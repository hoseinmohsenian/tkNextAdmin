import { useState } from "react";
import styles from "./TikkaaIncome.module.css";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import API from "../../../../../../api/index";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

function TikkaaIncome() {
    const [chartData, setChartData] = useState({});
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [loading, setLoading] = useState(false);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
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
                from = `from=${convertDate(startDate)}&`;
            }
            if (endDate?.year) {
                to = `to=${convertDate(endDate)}`;
            }

            const { data, status, response } = await API.get(
                `/admin/marketing/tikkaa/income?${from}${to}`
            );

            if (status === 200) {
                setChartData(data?.data);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error reading data from API", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    marketing: "مارکتینگ",
                    tk: "تیکا",
                    today: "جزئیات درآمد تیکا",
                }}
            />

            <Box title="جزئیات درآمد تیکا">
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
                            labels: Object.keys(chartData).reverse(),
                            datasets: [
                                {
                                    label: "درآمد",
                                    data: Object.values(chartData)
                                        .map((money) => money)
                                        .reverse(),
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
            </Box>
        </div>
    );
}

export default TikkaaIncome;
