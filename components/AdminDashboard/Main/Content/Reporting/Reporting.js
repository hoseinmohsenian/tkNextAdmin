import { useEffect, useState } from "react";
import styles from "./Reporting.module.css";
import { BASE_URL } from "../../../../../constants";
import moment from "jalali-moment";
import Box from "../Elements/Box/Box";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { useRouter } from "next/router";

const filtersSchema = {
    from: null,
    to: null,
    experimental: 0,
    language_id: 0,
    student: 0,
};
const appliedFiltersSchema = {
    from: false,
    to: false,
    experimental: false,
    language_id: false,
};

function Reporting({ token, languages }) {
    const [reportings, setReportings] = useState([]);
    const [filters, setFilters] = useState(filtersSchema);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
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

    const readReports = async (avoidFilters = false) => {
        setLoading(true);

        const searchQuery = "";
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };
            if (Number(filters.language_id) !== 0) {
                searchQuery += `language_id=${filters.language_id}&`;
                tempFilters["language_id"] = true;
            } else {
                tempFilters["language_id"] = false;
            }
            if (filters.student === 1) {
                if (Number(filters.experimental) !== 0) {
                    searchQuery += `experimental=1&`;
                    tempFilters["experimental"] = true;
                } else {
                    searchQuery += `unexperimental=1&`;
                    tempFilters["experimental"] = false;
                }
            }
            if (filters.from) {
                searchQuery += `from=${convertDate(filters.from)}&`;
                tempFilters["from"] = true;
            } else {
                tempFilters["from"] = false;
            }
            if (filters.to) {
                searchQuery += `to=${convertDate(filters.to)}&`;
                tempFilters["to"] = true;
            } else {
                tempFilters["to"] = false;
            }

            setAppliedFilters(tempFilters);
        }

        const apiString = filters.student
            ? "admin/reporting/marketing/student"
            : "admin/reporting/marketing/teacher";
        try {
            const res = await fetch(`${BASE_URL}/${apiString}?${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const { data } = await res.json();
            setReportings(data);
            setLoading(false);
        } catch (error) {
            console.log("Error reading reportings", error);
        }
    };

    useEffect(() => {
        setFilters({
            ...filters,
            from: null,
            to: null,
            experimental: 0,
            language_id: 0,
        });
        setAppliedFilters(appliedFiltersSchema);
        setReportings([]);
    }, [filters.student]);

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);
        readReports(true);
        router.push({
            pathname: `/tkpanel/database/query/building`,
            query: {},
        });
    };

    const showFilters = () => {
        let values = Object.values(appliedFilters);
        for (let i = 0; i < values.length; i++) {
            let value = values[i];
            if (value) {
                return false;
            }
        }
        return true;
    };

    return (
        <div>
            <Box title="گزارش گیری">
                <div className={styles["search"]}>
                    <div className={styles["search__header"]}>
                        <button
                            onClick={() =>
                                setFilters({ ...filters, student: 0 })
                            }
                            className={`${styles["header__btn"]} ${
                                filters.student === 0
                                    ? styles["header__btn--active"]
                                    : undefined
                            }`}
                        >
                            استاد
                        </button>
                        <button
                            onClick={() =>
                                setFilters({ ...filters, student: 1 })
                            }
                            className={`${styles["header__btn"]} ${
                                filters.student === 1
                                    ? styles["header__btn--active"]
                                    : undefined
                            }`}
                        >
                            زبان آموز
                        </button>
                    </div>

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
                                        htmlFor="language_id"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        زبان :
                                    </label>
                                    <div className="form-control">
                                        <select
                                            name="language_id"
                                            id="language_id"
                                            className="form__input input-select"
                                            onChange={handleOnChange}
                                            value={filters.language_id}
                                        >
                                            <option value={0}>
                                                انتخاب کنید
                                            </option>
                                            {languages?.map((lan) => (
                                                <option
                                                    key={lan?.id}
                                                    value={lan?.id}
                                                >
                                                    {lan?.persian_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {filters.student === 1 && (
                                <div
                                    className={`col-sm-6 ${styles["search-col"]}`}
                                >
                                    <div
                                        className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                    >
                                        <label
                                            htmlFor="experimental"
                                            className={`form__label ${styles["search-label"]}`}
                                        >
                                            وضعیت :
                                        </label>
                                        <div className="form-control form-control-radio">
                                            <div className="input-radio-wrapper">
                                                <label
                                                    htmlFor="is_experimental"
                                                    className="radio-title"
                                                >
                                                    تجربی
                                                </label>
                                                <input
                                                    type="checkbox"
                                                    name="experimental"
                                                    onChange={handleOnChange}
                                                    value={1}
                                                    checked={
                                                        Number(
                                                            filters.experimental
                                                        ) === 1
                                                    }
                                                    id="is_experimental"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                            {!showFilters() && (
                                <button
                                    type="button"
                                    className={`btn danger-outline ${styles["btn"]}`}
                                    disabled={loading}
                                    onClick={() => removeFilters()}
                                >
                                    {loading ? "در حال انجام ..." : "حذف فیلتر"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام و نام خانوادگی
                                </th>
                                <th className="table__head-item">موبایل</th>
                                <th className="table__head-item">ایمیل</th>
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
                                        {report?.email || "-"}
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

export default Reporting;
