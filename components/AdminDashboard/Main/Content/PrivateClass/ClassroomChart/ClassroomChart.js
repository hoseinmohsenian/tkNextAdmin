import { useEffect, useState } from "react";
import styles from "./ClassroomChart.module.css";
import Alert from "../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../constants";
import moment from "jalali-moment";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import Box from "../../Elements/Box/Box";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useGlobalContext } from "../../../../../../context/index";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

function ClassroomChart({ token }) {
    const [info, setInfo] = useState({});
    const [chartData, setChartData] = useState({});
    const [adminsChart, setAdminsChart] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [loading, setLoading] = useState(false);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const { useWindowSize } = useGlobalContext();
    const screenSize = useWindowSize();
    moment.locale("fa", { useGregorianParser: true });
    const colors = [
        "rgb(124, 181, 236)",
        "rgb(67, 67, 72)",
        "rgb(144, 237, 125)",
        "rgb(247, 163, 92)",
        "rgb(128, 133, 233)",
        "rgb(241, 92, 128)",
        "rgb(228, 211, 84)",
        "rgb(43, 144, 143)",
        "rgb(244, 91, 91)",
        "rgb(145, 232, 225)",
        "rgb(124, 181, 236)",
    ];

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (startDate.year && endDate.year) {
            await readData();
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const convertDate = (date) => {
        return moment
            .from(
                `${date?.year}/${date?.month}/${date?.day}`,
                "fa",
                "YYYY/MM/DD"
            )
            .locale("en")
            .format("YYYY/MM/DD")
            .replace("/", "-")
            .replace("/", "-");
    };

    const readData = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/classroom/first-class/chart?start_date=${convertDate(
                    startDate
                )}&end_date=${convertDate(endDate)}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const {
                    data: {
                        admin,
                        student,
                        all,
                        admin_separation,
                        admin_list,
                        ...data
                    },
                } = await res.json();
                setChartData(data);
                setInfo({ admin, student, all, admin_separation, admin_list });
            } else {
                const { error } = await res.json();
                showAlert(
                    true,
                    "warning",
                    error?.invalid_params[0]?.message || "مشکلی پیش آمده"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error reading data from API", error);
        }
    };

    const findAdmin = (id) => {
        return info.admin_list?.find((admin) => admin.id === Number(id))?.name;
    };

    // Chart init
    Chart.defaults.font = {
        size: 16,
        family: "IranianSans",
    };

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: screenSize.width >= 768 ? "right" : "bottom",
                labels: {
                    boxWidth: 5,
                    boxHeight: 5,
                    pointStyle: "circle",
                    usePointStyle: true,
                },
            },
        },
    };

    useEffect(() => {
        if (
            Boolean(info.admin_separation) &&
            Object.keys(chartData).length !== 0
        ) {
            let datas = Object.keys(info.admin_separation).map((admin_id) => {
                let data = [];
                Object.values(chartData).map(({ admin }) => {
                    if (Boolean(admin)) {
                        let res = Object.keys(admin).findIndex(
                            (day_admin_id) => day_admin_id === admin_id
                        );
                        if (res !== -1) {
                            data.push(Object.values(admin)[Number(res)]);
                        } else {
                            data.push(0);
                        }
                    } else {
                        // No "admin" key in the day's list
                        data.push(0);
                    }
                });
                return data;
            });
            setAdminsChart(
                Object.keys(info.admin_separation).map((admin_id, i) => {
                    let color =
                        colors[
                            (i % Object.keys(info.admin_separation).length) + 1
                        ];
                    return {
                        label: findAdmin(admin_id),
                        data: datas[i],
                        backgroundColor: color,
                        borderColor: color,
                        borderWidth: 1,
                    };
                })
            );
        }
    }, [info, chartData]);

    return (
        <div>
            <BreadCrumbs
                substituteObj={{ class: "کلاس", chart: "نمودار ثبت کلاس" }}
            />

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title="نمودار ثبت کلاس">
                <div className={styles["search"]}>
                    <form
                        className={styles["search-wrapper"]}
                        onSubmit={handleSubmit}
                    >
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="publish_time"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        تاریخ شروع :
                                        <span className="form__star">*</span>
                                    </label>
                                    <div className="form-control">
                                        <DatePicker
                                            value={startDate}
                                            onChange={setStartDate}
                                            shouldHighlightWeekends
                                            locale="fa"
                                            wrapperClassName="date-input-wrapper"
                                            inputClassName="date-input"
                                            colorPrimary="#545cd8"
                                            inputPlaceholder="انتخاب کنید"
                                            calendarPopperPosition="bottom"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="publish_time"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        تاریخ پایان :
                                        <span className="form__star">*</span>
                                    </label>
                                    <div className="form-control">
                                        <DatePicker
                                            value={endDate}
                                            onChange={setEndDate}
                                            shouldHighlightWeekends
                                            locale="fa"
                                            wrapperClassName="date-input-wrapper"
                                            inputClassName="date-input"
                                            colorPrimary="#545cd8"
                                            inputPlaceholder="انتخاب کنید"
                                            calendarPopperPosition="bottom"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles["btn-wrapper"]}>
                            <button
                                type="button"
                                className={`btn primary ${styles["btn"]}`}
                                disabled={loading}
                                onClick={() => readData()}
                            >
                                {loading ? "در حال انجام ..." : "جستجو"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className={styles.chart}>
                    <Line
                        data={{
                            backgroundColor: "pink",
                            labels: Object.keys(chartData),
                            datasets: [
                                {
                                    label: "زبان آموز",
                                    data: Object.values(chartData).map(
                                        ({ student }) => student
                                    ),
                                    backgroundColor: colors[0],
                                    borderColor: colors[0],
                                    borderWidth: 1,
                                },
                                ...adminsChart,
                            ],
                        }}
                        width={400}
                        // height={400}
                        options={chartOptions}
                    />
                </div>

                {Boolean(info.admin_separation) && (
                    <div className={styles["summary"]}>
                        <div className="table__wrapper">
                            <table className="table">
                                <thead className="table__head">
                                    <tr>
                                        <th className="table__head-item">
                                            ادمین
                                        </th>
                                        <th className="table__head-item">
                                            تعداد کلاس
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table__body">
                                    {Object.keys(info.admin_separation)?.map(
                                        (item, i) => {
                                            return (
                                                <tr
                                                    className="table__body-row"
                                                    key={i}
                                                >
                                                    <td className="table__body-item">
                                                        {findAdmin(item)}
                                                    </td>
                                                    <td className="table__body-item">
                                                        {
                                                            info
                                                                .admin_separation[
                                                                item
                                                            ]
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles["summary__sum"]}>
                            <span>
                                ادمین : {Intl.NumberFormat().format(info.admin)}
                            </span>
                            <span>
                                زبان آموز :{" "}
                                {Intl.NumberFormat().format(info.student)}
                            </span>
                            <span>
                                مجموع : {Intl.NumberFormat().format(info.all)}
                            </span>
                        </div>
                    </div>
                )}
            </Box>
        </div>
    );
}

export default ClassroomChart;
