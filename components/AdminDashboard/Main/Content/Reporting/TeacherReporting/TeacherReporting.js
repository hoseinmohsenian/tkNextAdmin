import { useState } from "react";
import styles from "./TeacherReporting.module.css";
import { BASE_URL } from "../../../../../../constants";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { ExportCSV } from "../../../../../exportToCSV/exportToCSV";

function TeacherReporting({ token }) {
    const [reportings, setReportings] = useState([]);
    const [filters, setFilters] = useState({
        from: null,
        to: null,
        status: 0,
        step: 0,
        video: 0,
        gender: 0,
    });
    const [loading, setLoading] = useState(false);
    moment.locale("fa", { useGregorianParser: true });

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
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

    const readReports = async () => {
        setLoading(true);

        const searchQuery = "";
        if (filters.from) {
            searchQuery += `from=${convertDate(filters.from)}&`;
        }
        if (filters.to) {
            searchQuery += `to=${convertDate(filters.to)}&`;
        }
        if (Number(filters.status) === 1) {
            searchQuery += `status=1&`;
        }
        if (Number(filters.gender) !== 0) {
            searchQuery += `gender=${filters.gender}&`;
        }
        if (Number(filters.step) !== 0) {
            searchQuery += `step=${filters.step}&`;
        }
        if (Number(filters.video) === 1) {
            searchQuery += `video=1&`;
        }

        try {
            const res = await fetch(
                `${BASE_URL}/admin/reporting/teacher?${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setReportings(data);
            setLoading(false);
        } catch (error) {
            console.log("Error reading reportings", error);
        }
    };

    return (
        <div>
            <Box title="گزارش گیری استاد">
                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        از :
                                    </label>
                                    <div className="form-control">
                                        <DatePicker
                                            value={filters.from}
                                            onChange={(date) =>
                                                setFilters({
                                                    ...filters,
                                                    from: date,
                                                })
                                            }
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
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        تا :
                                    </label>
                                    <div className="form-control">
                                        <DatePicker
                                            value={filters.to}
                                            onChange={(date) =>
                                                setFilters({
                                                    ...filters,
                                                    to: date,
                                                })
                                            }
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
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="step"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        استپ :
                                    </label>
                                    <div className="form-control">
                                        <select
                                            name="step"
                                            id="step"
                                            className="form__input input-select"
                                            onChange={handleOnChange}
                                            value={filters.step}
                                        >
                                            <option value={0}>همه</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                            <option value={6}>6</option>
                                            <option value={7}>7</option>
                                            <option value={8}>8</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        جنسیت :
                                    </label>
                                    <div className="form-control">
                                        <select
                                            name="gender"
                                            id="gender"
                                            className="form__input input-select"
                                            onChange={handleOnChange}
                                            value={filters.gender}
                                        >
                                            <option value={0}>هردو</option>
                                            <option value={1}>مرد</option>
                                            <option value={2}>زن</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        وضعیت :
                                    </label>
                                    <div className="form-control form-control-radio">
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="active"
                                                className="radio-title"
                                            >
                                                فعال
                                            </label>
                                            <input
                                                type="radio"
                                                name="status"
                                                onChange={handleOnChange}
                                                value={1}
                                                checked={
                                                    Number(filters.status) === 1
                                                }
                                                id="active"
                                            />
                                        </div>
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="inactive"
                                                className="radio-title"
                                            >
                                                غیرفعال
                                            </label>
                                            <input
                                                type="radio"
                                                name="status"
                                                onChange={handleOnChange}
                                                value={0}
                                                checked={
                                                    Number(filters.status) === 0
                                                }
                                                id="inactive"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        ویدئو معرفی :
                                    </label>
                                    <div className="form-control form-control-radio">
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="has"
                                                className="radio-title"
                                            >
                                                دارد
                                            </label>
                                            <input
                                                type="radio"
                                                name="video"
                                                onChange={handleOnChange}
                                                value={1}
                                                checked={
                                                    Number(filters.video) === 1
                                                }
                                                id="has"
                                            />
                                        </div>
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="has_not"
                                                className="radio-title"
                                            >
                                                ندارد
                                            </label>
                                            <input
                                                type="radio"
                                                name="video"
                                                onChange={handleOnChange}
                                                value={0}
                                                checked={
                                                    Number(filters.video) === 0
                                                }
                                                id="has_not"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles["btn-wrapper"]}>
                            <button
                                type="button"
                                className={`btn primary ${styles["btn"]}`}
                                disabled={loading}
                                onClick={() => readReports()}
                            >
                                {loading ? "در حال انجام ..." : "جستجو"}
                            </button>
                        </div>
                    </form>
                </div>

                {reportings.length !== 0 && (
                    <ExportCSV
                        data={reportings.map((report) => {
                            return {
                                name: report.name,
                                family: report.family,
                                mobile: report.mobile,
                            };
                        })}
                        fileName={"Tikkaa__teachers-report"}
                        fileExtension="xlsx"
                    />
                )}

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام و نام خانوادگی
                                </th>
                                <th className="table__head-item">موبایل</th>
                                <th className="table__head-item">استپ</th>
                                <th className="table__head-item">وضعیت</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {reportings?.map((report, i) => (
                                <tr className="table__body-row" key={i}>
                                    <td className="table__body-item">
                                        {filters.student
                                            ? report.name_family
                                            : `${report.name} ${report.family}`}
                                    </td>
                                    <td className="table__body-item">
                                        {report?.mobile || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {report?.step || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {report?.status === 1
                                            ? "فعال"
                                            : "غیرفعال"}
                                    </td>
                                </tr>
                            ))}

                            {reportings?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={filters.student ? 3 : 4}
                                    >
                                        گزارشی پیدا نشد
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

export default TeacherReporting;
