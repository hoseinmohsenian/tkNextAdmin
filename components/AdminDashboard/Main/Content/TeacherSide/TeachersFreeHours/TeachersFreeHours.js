import Link from "next/link";
import { useState } from "react";
import Box from "../../Elements/Box/Box";
import moment from "jalali-moment";
import styles from "./TeachersFreeHours.module.css";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import Alert from "../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../constants";

function TeachersFreeHours({ token, languages }) {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        gender: 0,
        from: 1,
        to: 1,
        price_from: "",
        price_to: "",
        language_id: 1,
    });
    const [selectedDate, setSelectedDate] = useState();
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    let times = [];
    moment.locale("fa", { useGregorianParser: true });

    // Constructing times array for time filter inputs
    const m = moment();
    m.set("hour", 24);
    m.set("minute", 0);
    for (let i = 1; i <= 48; i++) {
        let startHour = m.format("HH");
        let startMinute = m.format("mm");
        m.add(30, "minute");
        let endHour = m.format("HH");
        let endMinute = m.format("mm");
        let newItem = { key: i, startHour, startMinute, endHour, endMinute };
        times.push(newItem);
    }

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const searchTeachers = async (page = 1) => {
        const isFilterEnabled = (key) =>
            Number(filters[key]) !== 0 &&
            filters[key] !== undefined &&
            filters[key];

        // Constructing search parameters
        let searchQuery = "";
        Object.keys(filters).forEach((key) => {
            if (isFilterEnabled(key)) {
                searchQuery += `${key}=${filters[key]}&`;
            }
        });
        if (selectedDate?.year) {
            let date = moment
                .from(
                    `${selectedDate?.year}/${selectedDate?.month}/${selectedDate?.day}`,
                    "fa",
                    "YYYY/MM/DD"
                )
                .locale("en")
                .format("YYYY/MM/DD")
                .replace("/", "-")
                .replace("/", "-");
            searchQuery += `day=${date}&`;
        }
        searchQuery += `page=${page}`;

        try {
            setLoading(true);
            const res = await fetch(
                `${BASE_URL}/admin/teacher/freetime/${filters.language_id}?${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setTeachers(data);
                // setFilters(data);
                // setPagData(restData);
                showAlert(true, "success", "جستجو انجام شد");
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "danger",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false);
        } catch (error) {
            console.log("Error searching teachers", error);
        }
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={searchTeachers}
            />

            <Box
                title="لیست ساعت خالی استاد"
                buttonInfo={{
                    name: "لیست اساتید",
                    url: "/tkpanel/teachers",
                    color: "primary",
                }}
            >
                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="language_id"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        زبان:
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
                                                    key={lan.id}
                                                    value={lan.id}
                                                >
                                                    {lan.persian_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="publish_time"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        روز:
                                    </label>
                                    <div className="form-control">
                                        <DatePicker
                                            value={selectedDate}
                                            onChange={setSelectedDate}
                                            shouldHighlightWeekends
                                            locale="fa"
                                            wrapperClassName="date-input-wrapper"
                                            inputClassName="date-input"
                                            colorPrimary="#545cd8"
                                            minimumDate={{
                                                year: moment().year(),
                                                month: Number(
                                                    moment().format("M")
                                                ),
                                                day: Number(
                                                    moment().format("DD")
                                                ),
                                            }}
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
                                        htmlFor="from"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        از ساعت :
                                        <span className="form__star">*</span>
                                    </label>
                                    <div className="form-control">
                                        <select
                                            name="from"
                                            id="from"
                                            className="form__input input-select"
                                            onChange={handleOnChange}
                                            value={filters.from}
                                        >
                                            {times?.map((item) => (
                                                <option
                                                    key={item.key}
                                                    value={item.key}
                                                >
                                                    {`${item.startHour}:${item.startMinute}`}{" "}
                                                    تا{" "}
                                                    {`${item.endHour}:${item.endMinute}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="to"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        تا ساعت :
                                        <span className="form__star">*</span>
                                    </label>
                                    <div className="form-control">
                                        <select
                                            name="to"
                                            id="to"
                                            className="form__input input-select"
                                            onChange={handleOnChange}
                                            value={filters.to}
                                        >
                                            {times?.map((item) => (
                                                <option
                                                    key={item.key}
                                                    value={item.key}
                                                >
                                                    {`${item.startHour}:${item.startMinute}`}{" "}
                                                    تا{" "}
                                                    {`${item.endHour}:${item.endMinute}`}
                                                </option>
                                            ))}
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
                                        htmlFor="price_from"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        قیمت از :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="number"
                                            name="price_from"
                                            id="price_from"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.price_from}
                                            autoComplete="off"
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="price_to"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        قیمت تا :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="number"
                                            name="price_to"
                                            id="price_to"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.price_to}
                                            autoComplete="off"
                                            spellCheck={false}
                                        />
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
                                        htmlFor="gender"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        جنسیت :
                                    </label>
                                    <div className="form-control form-control-radio">
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="male"
                                                className="radio-title"
                                            >
                                                مرد
                                            </label>
                                            <input
                                                type="radio"
                                                name="gender"
                                                onChange={handleOnChange}
                                                value={1}
                                                checked={
                                                    Number(filters.gender) === 1
                                                }
                                                id="male"
                                            />
                                        </div>
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="desc"
                                                className="radio-title"
                                            >
                                                زن
                                            </label>
                                            <input
                                                type="radio"
                                                name="gender"
                                                onChange={handleOnChange}
                                                value={2}
                                                checked={
                                                    Number(filters.gender) === 2
                                                }
                                                id="female"
                                            />
                                        </div>
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="both"
                                                className="radio-title"
                                            >
                                                هردو
                                            </label>
                                            <input
                                                type="radio"
                                                name="gender"
                                                onChange={handleOnChange}
                                                value={0}
                                                checked={
                                                    Number(filters.gender) === 0
                                                }
                                                id="both"
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
                                onClick={() => searchTeachers()}
                            >
                                {loading ? "در حال انجام ..." : "اعمال فیلتر"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام</th>
                                <th className="table__head-item">
                                    نام خانوادگی
                                </th>
                                <th className="table__head-item">موبایل</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {teachers?.map((teacher) => (
                                <tr
                                    className="table__body-row"
                                    key={teacher?.id}
                                >
                                    <td className="table__body-item">
                                        {teacher?.name}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.family}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.mobile}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/teachers/${teacher?.slug}`}
                                        >
                                            <a className={`action-btn primary`}>
                                                پروفایل استاد‌
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {teachers.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={4}
                                    >
                                        استادی پیدا نشد
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

export default TeachersFreeHours;
