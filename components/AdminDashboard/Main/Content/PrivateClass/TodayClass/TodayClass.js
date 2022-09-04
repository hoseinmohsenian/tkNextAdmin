import { useState } from "react";
import styles from "./TodayClass.module.css";
import Pagination from "../../Pagination/Pagination";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";
import { useRouter } from "next/router";
import { useGlobalContext } from "../../../../../../context";
import Modal from "../../../../../Modal/Modal";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import API from "../../../../../../api";
import Alert from "../../../../../Alert/Alert";

const filtersSchema = {
    user_name: "",
    teacher_name: "",
    teacher_mobile: "",
    user_mobile: "",
    status: 0,
    first_class: false,
    pay: false,
};
const appliedFiltersSchema = {
    user_name: false,
    teacher_name: false,
    teacher_mobile: false,
    user_mobile: false,
    status: false,
    first_class: false,
    pay: false,
};

function TodayClass(props) {
    const {
        fetchedClasses: { data, ...restData },
        fetchedMeta,
        shamsi_date_obj,
    } = props;
    const [classes, setClasses] = useState(data);
    const [meta, setMeta] = useState(fetchedMeta);
    const [filters, setFilters] = useState(filtersSchema);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [pagData, setPagData] = useState(restData);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});
    const [selectedDate, setSelectedDate] = useState(shamsi_date_obj);
    const router = useRouter();
    moment.locale("fa", { useGregorianParser: true });
    const { formatTime } = useGlobalContext();
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    const readClasses = async (page = 1, avoidFilters = false) => {
        setLoading(true);

        let searchQuery = "";

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
        searchQuery = `date=${date}&`;

        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };
            Object.keys(filters).forEach((key) => {
                if (Number(filters[key]) !== 0) {
                    if (["first_class", "pay"].includes(key)) {
                        searchQuery += `${key}=${Number(filters[key])}&`;
                    } else {
                        searchQuery += `${key}=${filters[key]}&`;
                    }
                    tempFilters[key] = true;
                } else {
                    tempFilters[key] = false;
                }
            });

            setAppliedFilters(tempFilters);
        }
        searchQuery += `page=${page}`;

        let searchParams = {};
        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }
        router.push({
            pathname: `/tkpanel/class/requestDetails/today`,
            query: searchParams,
        });

        try {
            const { data, status, response } = await API.get(
                `/admin/classroom/today?${searchQuery}`
            );

            if (status === 200) {
                const { data: listData, ...restData } = data.data;
                setClasses(listData);
                setPagData(restData);
                setMeta(data.meta);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }

            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false);
        } catch (error) {
            console.log("Error reading classes", error);
        }
    };

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);
        readClasses(1, true);
        router.push({
            pathname: `/tkpanel/class/requestDetails/today`,
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
            <BreadCrumbs
                substituteObj={{ class: "کلاس", today: "کلاس های امروز" }}
            />

            <Alert {...alertData} removeAlert={showAlert} />

            <Box title="کلاس های امروز">
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات کلاس‌‌</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    اعتبار زبان آموز
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.user_wallet
                                        ? `${Intl.NumberFormat().format(
                                              selectedClass?.user_wallet
                                          )} تومان`
                                        : "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    کورس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.course_name}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    پلتفرم
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.platform_name}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    زبان
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.language_name}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    جلسه اول
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.first_class === 1
                                        ? "است"
                                        : "نیست"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    وضعیت پرداخت
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.pay === 1
                                        ? "پرداخت شده"
                                        : "پرداخت نشده"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    مدت کلاس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass.class_time
                                        ? `${selectedClass.class_time} دقیقه`
                                        : "-"}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`${styles["search-row"]}`}>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label
                                    htmlFor="publish_time"
                                    className={`form__label ${styles["search-label"]}`}
                                >
                                    تاریخ‌ :
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
                                        inputPlaceholder="انتخاب کنید"
                                        calendarPopperPosition="bottom"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="user_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        نام زبان آموز :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="user_name"
                                            id="user_name"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.user_name}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="user_mobile"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        شماره زبان آموز :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="tel"
                                            name="user_mobile"
                                            id="user_mobile"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.user_mobile}
                                            maxLength={11}
                                            pattern="\d*"
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
                                        htmlFor="teacher_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        نام استاد :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="teacher_name"
                                            id="teacher_name"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.teacher_name}
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
                                        htmlFor="teacher_mobile"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        شماره استاد :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="tel"
                                            name="teacher_mobile"
                                            id="teacher_mobile"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.teacher_mobile}
                                            maxLength={11}
                                            pattern="\d*"
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
                                    <div
                                        className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                    >
                                        <label
                                            htmlFor="first_class"
                                            className={`form__label ${styles["search-label"]}`}
                                        >
                                            جلسه اول :
                                        </label>
                                        <div className="form-control form-control-radio">
                                            <div className="input-radio-wrapper">
                                                <label
                                                    htmlFor="first_class"
                                                    className="radio-title"
                                                >
                                                    جلسه اول
                                                </label>
                                                <input
                                                    type="checkbox"
                                                    name="first_class"
                                                    onChange={handleOnChange}
                                                    value={1}
                                                    checked={
                                                        Number(
                                                            filters.first_class
                                                        ) === 1
                                                    }
                                                    id="first_class"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="pay"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        پرداخت :
                                    </label>
                                    <div className="form-control form-control-radio">
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="pay"
                                                className="radio-title"
                                            >
                                                پرداخت شده
                                            </label>
                                            <input
                                                type="checkbox"
                                                name="pay"
                                                onChange={handleOnChange}
                                                value={1}
                                                checked={
                                                    Number(filters.pay) === 1
                                                }
                                                id="pay"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`row ${styles["search-row"]}`}>
                            <div
                                className={`col-sm-12 ${styles["search-col"]}`}
                            >
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="status"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        وضعیت :
                                    </label>
                                    <div className="form-control form-control-radio">
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="canceled"
                                                className="radio-title"
                                            >
                                                کنسل شده
                                            </label>
                                            <input
                                                type="radio"
                                                name="status"
                                                onChange={handleOnChange}
                                                value={2}
                                                checked={
                                                    Number(filters.status) === 2
                                                }
                                                id="canceled"
                                            />
                                        </div>
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="held"
                                                className="radio-title"
                                            >
                                                برگزار شده
                                            </label>
                                            <input
                                                type="radio"
                                                name="status"
                                                onChange={handleOnChange}
                                                value={1}
                                                checked={
                                                    Number(filters.status) === 1
                                                }
                                                id="held"
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
                                                name="status"
                                                onChange={handleOnChange}
                                                value={0}
                                                checked={
                                                    Number(filters.status) === 0
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
                                onClick={() => readClasses()}
                            >
                                {loading ? "در حال انجام ..." : "اعمال فیلتر"}
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

                {classes.length !== 0 && (
                    <div className="row">
                        <div className={`col-sm-6 col-lg-3 ${styles.card}`}>
                            <div className={styles.card__box}>
                                <span className={styles.card__title}>
                                    تعداد کلاس های امروز
                                </span>
                                <span className={styles.card__number}>
                                    {meta.all_class}
                                </span>
                            </div>
                        </div>
                        <div className={`col-sm-6 col-lg-2 ${styles.card}`}>
                            <div className={styles.card__box}>
                                <span className={styles.card__title}>
                                    جلسه اولی
                                </span>
                                <span className={styles.card__number}>
                                    {meta.first_class}
                                </span>
                            </div>
                        </div>
                        <div className={`col-sm-6 col-lg-2 ${styles.card}`}>
                            <div className={styles.card__box}>
                                <span className={styles.card__title}>
                                    برگزار شده
                                </span>
                                <span className={styles.card__number}>
                                    {meta.held_class}
                                </span>
                            </div>
                        </div>
                        <div className={`col-sm-6 col-lg-2 ${styles.card}`}>
                            <div className={styles.card__box}>
                                <span className={styles.card__title}>
                                    کنسل شده
                                </span>
                                <span className={styles.card__number}>
                                    {meta.cancel_class}
                                </span>
                            </div>
                        </div>
                        <div className={`col-sm-6 col-lg-3 ${styles.card}`}>
                            <div className={styles.card__box}>
                                <span className={styles.card__title}>
                                    پرداخت نشده
                                </span>
                                <span className={styles.card__number}>
                                    {meta.not_payed_class}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام زبان آموز
                                </th>
                                <th className="table__head-item">
                                    شماره زبان آموز
                                </th>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">وضعیت کلاس</th>
                                <th className="table__head-item">قیمت</th>
                                <th className="table__head-item">ساعت کلاس</th>
                                <th className="table__head-item">تاریخ کلاس</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {classes?.map((item) => (
                                <tr className="table__body-row" key={item?.id}>
                                    <td className="table__body-item">
                                        {item?.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.user_mobile}
                                        {item?.user_mobile && (
                                            <Link
                                                href={`https://api.whatsapp.com/send?phone=98${item.user_mobile?.slice(
                                                    1
                                                )}`}
                                            >
                                                <a className="whatsapp-icon">
                                                    <span>
                                                        <AiOutlineWhatsApp />
                                                    </span>
                                                </a>
                                            </Link>
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.status === 0 &&
                                            "تعیین وضعیت نشده"}
                                        {item?.status === 1 && "برگزار شده"}
                                        {item?.status === 2 && "کنسل شده"}
                                        {item?.status === 3 && "لغو بازگشت پول"}
                                        {item?.status === 4 && "غیبت"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.price
                                            ? `${Intl.NumberFormat().format(
                                                  item?.price
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item.time && item.time !== "[]"
                                            ? formatTime(item.time)
                                            : "-"}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment(item?.date).format(
                                            "YYYY/MM/DD"
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedClass(item);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {classes?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={13}
                                    >
                                        کلاسی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {classes.length !== 0 && (
                    <Pagination read={readClasses} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default TodayClass;
