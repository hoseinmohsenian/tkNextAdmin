import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import Box from "../../Elements/Box/Box";
import styles from "./TodayMonitoring.module.css";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import moment from "jalali-moment";
import { useGlobalContext } from "../../../../../../context";
import Modal from "../../../../../Modal/Modal";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";
import TeacherMobileTooltip from "../../../../../TeacherMobileTooltip/TeacherMobileTooltip";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";
import { Select } from "antd";

const filtersSchema = { user_name: "", teacher_name: "" };
const appliedFiltersSchema = { user_name: false, teacher_name: false };

function TodayMonitoring({ token, monitorings, shamsi_date_obj, admins }) {
    const [monitoringList, setMonitoringList] = useState(monitorings);
    const [formData, setFormData] = useState(monitorings);
    const [selectedDate, setSelectedDate] = useState(shamsi_date_obj);
    const [filters, setFilters] = useState(filtersSchema);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(
        Array(monitorings?.length).fill(false)
    );
    moment.locale("fa", { useGregorianParser: true });
    const { formatTime } = useGlobalContext();
    const [openModal, setOpenModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});
    const { Option } = Select;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const handleLoadings = (i, value) => {
        let temp = [...loadings];
        temp[i] = value;
        setLoadings(() => temp);
    };

    const readMonitoring = async (avoidFilters = false) => {
        // Constructing search parameters
        let searchQuery = "";
        const isFilterEnabled = (key) =>
            Number(filters[key]) !== 0 &&
            filters[key] !== undefined &&
            filters[key];
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };

            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    searchQuery += `${key}=${filters[key]}&`;
                    tempFilters[key] = true;
                } else {
                    tempFilters[key] = false;
                }
            });
            setAppliedFilters(tempFilters);
        }

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
        searchQuery += `date=${date}`;

        try {
            setLoading(true);
            const res = await fetch(
                `${BASE_URL}/admin/classroom/monitoring?${searchQuery}`,
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
            setFormData(data);
            setLoading(false);
        } catch (error) {
            console.log("Error reading monitoring list", error);
        }
    };

    const addFollower = async (i, monitoring_id, monitoring_follower) => {
        try {
            handleLoadings(i, true);
            const res = await fetch(
                `${BASE_URL}/admin/classroom/monitoring/${monitoring_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        admin_id: Number(monitoring_follower),
                    }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(true, "success", "ادمین باموفقیت اضافه شد");
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding monitoring follower", error);
        }
        handleLoadings(i, false);
    };

    const handleOnChange = (value, rowInd) => {
        let updated = [...monitoringList];
        const monitoring_follower = value;
        updated[rowInd] = {
            ...updated[rowInd],
            monitoring_follower: monitoring_follower,
        };
        setMonitoringList(() => updated);

        addFollowerHandler(rowInd, monitoring_follower);
    };

    const addFollowerHandler = (i, monitoring_follower) => {
        const monitoring_id = monitoringList[i].id;
        if (Number(monitoring_follower) !== 0) {
            addFollower(i, monitoring_id, monitoring_follower);
        }
    };

    const filtersOnChangeHandler = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);
        readMonitoring(true);
    };

    const showFilters = () => {
        let values = Object.values(appliedFilters);
        for (let i = 0; i < values.length; i++) {
            let value = values[i];
            if (value) {
                return true;
            }
        }
        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await readTeachers();
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={readMonitoring}
            />

            <BreadCrumbs
                substituteObj={{
                    monitoring: "مانیتورینگ",
                    getTodayClasses: "مانیتورینگ امروز",
                }}
            />

            <Box title="مانیتورینگ امروز">
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
                                    {selectedClass?.platform_name || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    زبان
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass.language_name}
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
                                    قیمت
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.price
                                        ? `${Intl.NumberFormat().format(
                                              selectedClass?.price
                                          )} تومان`
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
                                    <span className="form__star">*</span>
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
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
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
                                            onChange={filtersOnChangeHandler}
                                            value={filters?.user_name}
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
                                            onChange={filtersOnChangeHandler}
                                            value={filters?.teacher_name}
                                            spellCheck={false}
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
                                onClick={() => readMonitoring()}
                            >
                                {loading ? "در حال جستجو ..." : "جستجو"}
                            </button>
                            {showFilters() && (
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

                <div className="table__wrapper table__wrapper--wrap">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">زبان آموز</th>
                                <th className="table__head-item">
                                    موبایل زبان آموز
                                </th>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">وضعیت کلاس</th>
                                <th className="table__head-item">
                                    وضعیت پرداخت
                                </th>
                                <th className="table__head-item">
                                    پیگیری کلاس
                                </th>
                                <th className="table__head-item">مدت کلاس</th>
                                <th className="table__head-item">تاریخ</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {monitoringList?.map((item, i) => {
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
                                            {item?.user_name || "-"}
                                        </td>
                                        <td className="table__body-item">
                                            {item?.user_mobile || "-"}
                                            {item?.user_mobile && (
                                                <Link
                                                    href={`https://api.whatsapp.com/send?phone=98${item.user_mobile?.slice(
                                                        1
                                                    )}&text=سلام ${
                                                        item.user_name
                                                    } عزیز وقت بخیر افشاری، پشتیبان سامانه آموزش زبان تیکا هستم. کلاس شما، ${date} با استاد ${
                                                        item?.teacher_name
                                                    } تشکیل می شود. لینک ورود به کلاس، نیم ساعت قبل از شروع، پیامک(sms) می شود. موفق باشید.`}
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
                                        <td className="table__body-item">
                                            {item?.teacher_name}
                                            <TeacherMobileTooltip
                                                mobile={item.teacher_mobile}
                                            />
                                        </td>
                                        <td className="table__body-item">
                                            {item?.status === 0 &&
                                                "تعیین وضعیت نشده"}
                                            {item?.status === 1 && "برگزار شده"}
                                            {item?.status === 2 && "کنسل شده"}
                                            {item?.status === 3 &&
                                                "لغو بازگشت پول"}
                                            {item?.status === 4 && "غیبت"}
                                        </td>
                                        <td className="table__body-item">
                                            {item?.pay === 1
                                                ? "پرداخت شده"
                                                : "پرداخت نشده"}
                                        </td>
                                        <td className="table__body-item">
                                            <div
                                                style={{
                                                    width: "130px",
                                                }}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="انتخاب کنید"
                                                    optionFilterProp="children"
                                                    onChange={(value) => {
                                                        handleOnChange(
                                                            value,
                                                            i
                                                        );
                                                    }}
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .includes(
                                                                input.toLowerCase()
                                                            )
                                                    }
                                                    defaultValue={
                                                        item.monitoring_follower ||
                                                        0
                                                    }
                                                    style={{
                                                        width: 130,
                                                    }}
                                                >
                                                    <Option value={0}>
                                                        انتخاب کنید
                                                    </Option>
                                                    {admins.map((admin) => (
                                                        <Option
                                                            key={admin.id}
                                                            value={admin.id}
                                                        >
                                                            {admin.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </td>
                                        <td className="table__body-item">
                                            {item?.class_time
                                                ? `${item?.class_time} دقیقه`
                                                : "-"}
                                        </td>
                                        <td className="table__body-item">
                                            {item?.date
                                                ? `${moment
                                                      .from(
                                                          item?.date
                                                              .replace("-", "/")
                                                              .replace(
                                                                  "-",
                                                                  "/"
                                                              ),
                                                          "en",
                                                          "YYYY/MM/DD"
                                                      )
                                                      .locale("fa")
                                                      .format("DD MMMM YYYY")}`
                                                : "-"}
                                            {item.time
                                                ? `, ساعت ${formatTime(
                                                      item.time
                                                  )}`
                                                : "-"}
                                        </td>
                                        <td className="table__body-item">
                                            <button
                                                className={`action-btn success`}
                                                onClick={() => {
                                                    setSelectedClass(
                                                        () => item
                                                    );
                                                    setOpenModal(true);
                                                }}
                                            >
                                                جزئیات
                                            </button>
                                            <Link
                                                href={`/tkpanel/logReport/show/create?type=class&user_name=${item.user_name}&user_id=${item.user_id}&teacher_name=${item.teacher_name}&teacher_id=${item.teacher_id}`}
                                            >
                                                <a
                                                    className={`action-btn warning`}
                                                    target="_blank"
                                                >
                                                    لاگ پیگیری
                                                </a>
                                            </Link>
                                            <Link
                                                href={`${SITE_URL}/class-link/${item.url}`}
                                            >
                                                <a
                                                    className={`action-btn primary`}
                                                    target="_blank"
                                                >
                                                    برو به کلاس
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

export default TodayMonitoring;
