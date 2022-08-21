import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../../Elements/Box/Box";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import moment from "jalali-moment";
import { TimePicker } from "antd";
import styles from "./CreateLog.module.css";
import API from "../../../../../../api/index";
import Link from "next/link";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

function CreateLog({
    statusList,
    admins,
    type,
    user_id,
    user_name,
    teacher_id,
    teacher_name,
    parent_id,
}) {
    const [formData, setFormData] = useState({
        desc: "",
        status: 0,
        admin_assign_id: 0,
        parent_id: parent_id,
        next_tracking_time_status: 0,
        next_tracking_date: null,
        next_tracking_time: "00:00",
    });
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(formData.status) !== 0) {
            const fd = new FormData();
            fd.append("status", Number(formData.status));
            if (formData.desc) {
                fd.append("desc", formData.desc);
            }
            if (type !== "teacher") {
                fd.append("user_id", Number(user_id));
            }
            if (type !== "student") {
                fd.append("teacher_id", Number(teacher_id));
            }
            if (Number(formData.admin_assign_id) !== 0) {
                fd.append("admin_assign_id", Number(formData.admin_assign_id));
            }
            if (Number(formData.parent_id)) {
                fd.append("parent_id", Number(formData.parent_id));
            }
            if (formData.next_tracking_time_status) {
                if (formData.next_tracking_date?.year) {
                    let date = moment
                        .from(
                            `${formData.next_tracking_date?.year}/${formData.next_tracking_date?.month}/${formData.next_tracking_date?.day}`,
                            "fa",
                            "YYYY/MM/DD"
                        )
                        .locale("en")
                        .format("YYYY/MM/DD")
                        .replace("/", "-")
                        .replace("/", "-");
                    fd.append(
                        "next_tracking_time",
                        `${date}T${formData.next_tracking_time}:00`
                    );
                }
            }

            await submitLog(fd);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        let updatedFormData = { ...formData, [name]: value };

        if (name === "status") {
            updatedFormData = {
                ...updatedFormData,
                next_tracking_time_status: statusList.find(
                    (sts) => sts.id === Number(value)
                )?.next_tracking_time,
            };
        }
        setFormData(updatedFormData);
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const submitLog = async (fd) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/tracking-log`,
                fd
            );

            if (status === 200) {
                showAlert(true, "success", "لاگ باموفقیت ثبت شد");
                if (type === "class") {
                    router.push(`/tkpanel/monitoring/getTodayMonitoring`);
                } else {
                    router.push(
                        `/tkpanel/multiSessionsList/logs/${
                            type === "student" ? user_id : teacher_id
                        }?type=${type}`
                    );
                }
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding log", error);
        }
        setLoading(false);
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />
            <BreadCrumbs
                substituteObj={{
                    logReport: type === "student" ? "زبان‌آموز" : "استاد‌",
                    show: "تاریخچه لاگ‌",
                    create: "ایجاد",
                }}
            />

            <Box title="ایجاد لاگ">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="status" className="form__label">
                            وضعیت :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="status"
                                id="status"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.status}
                                required
                            >
                                <option value={0}>انتخاب کنید</option>
                                {statusList?.map((status) => (
                                    <option key={status?.id} value={status?.id}>
                                        {status?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Link href="/tkpanel/logReport/status/create">
                            <a
                                className={`action-btn primary ${styles["discount-btn"]}`}
                                target="_blank"
                            >
                                ایجاد وضعیت
                            </a>
                        </Link>
                    </div>
                    {formData.next_tracking_time_status ? (
                        <div className="row">
                            <div className={`col-md-6 ${styles.col}`}>
                                <div
                                    className="input-wrapper"
                                    style={{ width: "100%" }}
                                >
                                    <label className="form__label">
                                        تاریخ پیگیری بعدی :
                                    </label>
                                    <div className="form-control">
                                        <DatePicker
                                            value={formData.next_tracking_date}
                                            onChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    next_tracking_date: value,
                                                })
                                            }
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
                            <div className={`col-md-6`}>
                                <div
                                    className={`input-wrapper`}
                                    style={{ width: "100%" }}
                                >
                                    <label
                                        htmlFor="time"
                                        className={`form__label`}
                                    >
                                        ساعت :
                                    </label>
                                    <div className="form-control">
                                        <TimePicker
                                            minuteStep={30}
                                            format="HH:mm"
                                            placeholder="انتخاب ساعت"
                                            bordered={false}
                                            onChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    next_tracking_time:
                                                        moment(value).format(
                                                            "HH:mm"
                                                        ),
                                                })
                                            }
                                            value={moment(
                                                formData.next_tracking_time ||
                                                    "",
                                                "HH:mm"
                                            )}
                                            className="time-picker"
                                            popupClassName="popup-time-picker"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                    {type !== "teacher" && (
                        <div className="input-wrapper">
                            <label htmlFor="user_name" className="form__label">
                                زبان آموز :
                            </label>
                            <div className="form-control">
                                <input
                                    type="text"
                                    name="user_name"
                                    id="user_name"
                                    className="form__input"
                                    spellCheck={false}
                                    value={user_name}
                                    disabled
                                />
                            </div>
                            <Link
                                href={`/tkpanel/multiSessionsList/logs/${user_id}?type=student`}
                            >
                                <a
                                    className={`action-btn primary ${styles["discount-btn"]}`}
                                    target="_blank"
                                >
                                    لاگ
                                </a>
                            </Link>
                        </div>
                    )}
                    {type !== "student" && (
                        <div className="input-wrapper">
                            <label
                                htmlFor="teacher_name"
                                className="form__label"
                            >
                                استاد :
                            </label>
                            <div className="form-control">
                                <input
                                    type="text"
                                    name="teacher_name"
                                    id="teacher_name"
                                    className="form__input"
                                    spellCheck={false}
                                    value={teacher_name}
                                    disabled
                                />
                            </div>
                            <Link
                                href={`/tkpanel/multiSessionsList/logs/${teacher_id}?type=teacher`}
                            >
                                <a
                                    className={`action-btn primary ${styles["discount-btn"]}`}
                                    target="_blank"
                                >
                                    لاگ
                                </a>
                            </Link>
                        </div>
                    )}
                    <div className="input-wrapper">
                        <label htmlFor="english_name" className="form__label">
                            توضیحات :
                        </label>
                        <textarea
                            type="text"
                            name="desc"
                            id="desc"
                            className="form__textarea"
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="admin_assign_id"
                            className="form__label"
                        >
                            ادمین پیگیر (منشن) :
                        </label>
                        <div className="form-control">
                            <select
                                name="admin_assign_id"
                                id="admin_assign_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.admin_assign_id}
                            >
                                <option value={0}>انتخاب کنید</option>
                                {admins?.map((admin) => (
                                    <option key={admin?.id} value={admin?.id}>
                                        {admin?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ثبت لاگ"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreateLog;
