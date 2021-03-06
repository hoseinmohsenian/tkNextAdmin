import { useState } from "react";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";
import styles from "./DoneMonitoring.module.css";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import moment from "jalali-moment";
import Link from "next/link";
import { useGlobalContext } from "../../../../../../context";
import Modal from "../../../../../Modal/Modal";
import { AiOutlineWhatsApp, AiOutlineInfoCircle } from "react-icons/ai";
import ReactTooltip from "react-tooltip";

function DoneMonitoring({ token, monitorings, shamsi_date_obj }) {
    const [monitoringList, setMonitoringList] = useState(monitorings);
    const [selectedDate, setSelectedDate] = useState(shamsi_date_obj);
    const [loading, setLoading] = useState(false);
    moment.locale("fa", { useGregorianParser: true });
    const { formatTime } = useGlobalContext();
    const [openModal, setOpenModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});

    const readMonitoring = async () => {
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
        searchQuery = `date=${date}`;

        try {
            setLoading(true);
            const res = await fetch(
                `${BASE_URL}/admin/classroom/monitoring/done?${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setMonitoringList(data);
            setLoading(false);
        } catch (error) {
            console.log("Error reading monitoring list", error);
        }
    };

    return (
        <div>
            <Box title="مانیتورینگ انجام شده">
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
                                    پیگیری کلاس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.monitoring_follower_name ||
                                        "-"}
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
                                    وضعیت کلاس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.status === 0 &&
                                        "تعیین وضعیت نشده"}
                                    {selectedClass?.status === 1 &&
                                        "برگزار شده"}
                                    {selectedClass?.status === 2 && "کنسل شده"}
                                    {selectedClass?.status === 3 &&
                                        "لغو بازگشت پول"}
                                    {selectedClass?.status === 4 && "غیبت"}
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
                                    {selectedClass?.class_time
                                        ? `${selectedClass?.class_time} دقیقه`
                                        : "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ساعت کلاس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass.time
                                        ? formatTime(selectedClass.time)
                                        : "-"}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <ReactTooltip className="tooltip" />

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
                                    />
                                </div>
                            </div>
                            <div className={styles["btn-wrapper"]}>
                                <button
                                    type="button"
                                    className={`btn primary ${styles["btn"]}`}
                                    disabled={loading}
                                    onClick={() => readMonitoring()}
                                >
                                    {loading ? "در حال جستجو ..." : "جستجو"}
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
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">زبان</th>
                                <th className="table__head-item">قیمت</th>
                                <th className="table__head-item">تاریخ</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {monitoringList?.map((item) => {
                                let date = item?.date
                                    ? `${moment
                                          .from(
                                              item?.date
                                                  .replace("-", "/")
                                                  .replace("-", "/"),
                                              "en",
                                              "YYYY/MM/DD"
                                          )
                                          .locale("fa")
                                          .format("DD MMMM YYYY")} , ${
                                          item?.time && item?.time !== "[]"
                                              ? formatTime(item?.time)
                                              : "-"
                                      }`
                                    : "-";

                                return (
                                    <tr
                                        className="table__body-row"
                                        key={item?.id}
                                    >
                                        <td className="table__body-item">
                                            {item?.user_name}
                                        </td>
                                        <td className="table__body-item">
                                            {item?.user_mobile || "-"}
                                            {item?.user_mobile && (
                                                <Link
                                                    href={`https://api.whatsapp.com/send?phone=${item.user_mobile}&text=سلام ${item.user_name} عزیز وقت بخیر افشاری، پشتیبان سامانه آموزش زبان تیکا هستم. کلاس شما، ${date} با استاد ${item?.teacher_name} تشکیل می شود. لینک ورود به کلاس، نیم ساعت قبل از شروع، پیامک(sms) می شود. موفق باشید.`}
                                                >
                                                    <a
                                                        className="whatsapp-icon"
                                                        target="_blank"
                                                    >
                                                        <span>
                                                            <AiOutlineWhatsApp />
                                                        </span>
                                                    </a>
                                                </Link>
                                            )}
                                        </td>
                                        <td
                                            className="table__body-item"
                                            data-tip={
                                                item?.teacher_mobile || "-"
                                            }
                                        >
                                            {item?.teacher_name}
                                            <span className="info-icon">
                                                <AiOutlineInfoCircle />
                                            </span>
                                        </td>
                                        <td className="table__body-item">
                                            {item?.language_name}
                                        </td>
                                        <td className="table__body-item">
                                            {item?.price
                                                ? `${Intl.NumberFormat().format(
                                                      item?.price
                                                  )} تومان`
                                                : "-"}
                                        </td>
                                        <td className="table__body-item">
                                            {date}
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
                                            <Link
                                                href={`/tkpanel/multiSessionsList/logs/${item.id}?type=monitoring`}
                                            >
                                                <a
                                                    className={`action-btn warning`}
                                                    target="_blank"
                                                >
                                                    لاگ پیگیری
                                                </a>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}

                            {monitoringList.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={16}
                                    >
                                        آیتمی پیدا نشد
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

export default DoneMonitoring;
