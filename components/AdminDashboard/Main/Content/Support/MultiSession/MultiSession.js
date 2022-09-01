import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import Box from "../../Elements/Box/Box";
import styles from "./MultiSession.module.css";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import moment from "jalali-moment";
import Link from "next/link";
import Modal from "../../../../../Modal/Modal";
import { useGlobalContext } from "../../../../../../context";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";
import API from "../../../../../../api";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";
import ReactTooltip from "react-tooltip";

function MultiSession() {
    const [classes, setClasses] = useState([]);
    const [selectedDate, setSelectedDate] = useState();
    const [loadings, setLoadings] = useState([]);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    moment.locale("fa", { useGregorianParser: true });
    const [openModal, setOpenModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});
    const { formatTime } = useGlobalContext();

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const readClasses = async () => {
        // Constructing search parameters
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

        try {
            setLoading(true);

            const { response, status, data } = await API.get(
                `/admin/support/classroom/last?${searchQuery}`
            );

            if (status === 200) {
                if (data?.data?.length === 0) {
                    showAlert(true, "warning", "نتیجه ای یافت نشد");
                } else {
                    showAlert(true, "success", "جستجو انجام شد");
                }
                setClasses(data?.data);
                setLoadings(Array(data?.data?.length).fill(false));
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
        } catch (error) {
            console.log("Error reading classes", error);
        }
        setLoading(false);
    };

    const readClassesHandler = async () => {
        if (selectedDate?.year) {
            await readClasses();
        } else {
            showAlert(true, "danger", "لطفا تاریخ را انتخاب کنید");
        }
    };

    const loadingsHanlder = (i, value) => {
        let temp = [...loadings];
        temp[i] = value;
        setLoadings(() => temp);
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={readClasses}
            />

            <BreadCrumbs
                substituteObj={{
                    multiSessionsList: "۵ جلسه ۱۰ جلسه",
                }}
            />

            <ReactTooltip className="tooltip" type="dark" />

            <Box title="۵ جلسه ۱۰ جلسه">
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
                                    زبان
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass.language_name || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    پلتفرم
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.platform_name || "-"}
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
                                    قیمت
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass.price
                                        ? `${Intl.NumberFormat().format(
                                              selectedClass.price
                                          )} تومان`
                                        : "-"}
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
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ساعت کلاس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass.time &&
                                    selectedClass.time !== "[]"
                                        ? formatTime(selectedClass.time)
                                        : "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    تاریخ
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass.date
                                        ? moment(selectedClass.date).format(
                                              "YYYY/MM/DD"
                                          )
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
                                    آخرین جلسه برگزار شده :
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
                            <div className={styles["btn-wrapper"]}>
                                <button
                                    type="button"
                                    className={`btn primary ${styles["btn"]}`}
                                    disabled={loading}
                                    onClick={readClassesHandler}
                                >
                                    {loading
                                        ? "در حال جستجو ..."
                                        : "اعمال فیلتر"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">زبان آموز</th>
                                <th className="table__head-item">
                                    موبایل زبان آموز
                                </th>
                                <th className="table__head-item">نوع جلسه</th>
                                <th className="table__head-item">وضعیت کلاس</th>
                                <th className="table__head-item">
                                    تاریخ آخرین تراکنش
                                </th>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {classes?.map((item, i) => (
                                <tr className="table__body-row" key={item?.id}>
                                    <td className="table__body-item">
                                        {item?.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.user_mobile || "-"}
                                        {item?.user_mobile && (
                                            <Link
                                                href={`https://api.whatsapp.com/send?phone=${item.user_mobile}`}
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
                                        {item.course_name || "-"}
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
                                        {item?.last_transaction || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.teacher_name}
                                        {item.status === 0 && (
                                            <span
                                                data-tip="وضعیت غیرفعال"
                                                className="danger-color"
                                                style={{
                                                    marginRight: 2,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <MdOutlineDoNotDisturbAlt />
                                            </span>
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/multiSessionsList/logs/${item.user_id}?type=student`}
                                        >
                                            <a
                                                className={`action-btn warning`}
                                                target="_blank"
                                            >
                                                لاگ پیگیری&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/dashboard/student/${item.user_id}`}
                                        >
                                            <a
                                                className={`action-btn primary`}
                                                target="_blank"
                                            >
                                                ورودی به پنل
                                            </a>
                                        </Link>
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

                            {classes.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={11}
                                    >
                                        کلاسی پیدا نشد
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

export default MultiSession;
