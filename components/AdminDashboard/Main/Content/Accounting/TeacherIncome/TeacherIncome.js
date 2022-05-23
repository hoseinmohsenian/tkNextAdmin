import { useState } from "react";
import styles from "./TeacherIncome.module.css";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { BASE_URL } from "../../../../../../constants/index";

function TeacherIncome({ token }) {
    const [chartData, setChartData] = useState({});
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [loading, setLoading] = useState(false);
    moment.locale("fa", { useGregorianParser: true });

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
                position: "top",
                labels: {
                    boxWidth: 20,
                    boxHeight: 11,
                    // pointStyle: "circle",
                    // usePointStyle: true,
                },
            },
        },
    };

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
            let from = "",
                to = "";
            if (startDate?.year) {
                from = `start=${convertDate(startDate)}&`;
            }
            if (endDate?.year) {
                to = `end=${convertDate(endDate)}`;
            }
            const res = await fetch(
                `${BASE_URL}/admin/accounting/teacher/income?${from}${to}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setChartData(data);
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

    return (
        <div>
            <Box title="جزئیات درآمد اساتید">
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
                            labels: Object.values(chartData).map(
                                ({ teacher_name }) => teacher_name
                            ),
                            datasets: [
                                {
                                    label: "درآمد",
                                    data: Object.values(chartData).map(
                                        ({ amount }) => amount
                                    ),
                                    backgroundColor: "#e9f3fc",
                                    borderColor: "rgb(124, 181, 236)",
                                    borderWidth: 1,
                                    fill: true,
                                },
                            ],
                        }}
                        width={400}
                        // height={400}
                        options={chartOptions}
                    />
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">مبلغ</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {Object.values(chartData).map((teacher, i) => (
                                <tr className="table__body-row" key={i}>
                                    <td className="table__body-item">
                                        {teacher.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {Intl.NumberFormat().format(
                                            teacher.amount
                                        )}{" "}
                                        تومان
                                    </td>
                                </tr>
                            ))}

                            {Object.values(chartData).length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={2}
                                    >
                                        آیتمی پیدا نشد!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>
        </div>
    );
}

export default TeacherIncome;
