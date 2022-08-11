import { useState, useEffect } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../../Elements/Box/Box";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import moment from "jalali-moment";
import { TimePicker } from "antd";
import styles from "./EditLog.module.css";
import API from "../../../../../../api/index";

function EditLog({ statusList, theLog, admins, type }) {
    const [formData, setFormData] = useState(theLog);
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
            if (Number(formData.status) !== theLog.status) {
                fd.append("status", Number(formData.status));
            }
            if (formData.desc && formData.desc !== theLog.desc) {
                fd.append("desc", formData.desc);
            }
            if (
                Number(formData.admin_assign_id) !== 0 &&
                Number(formData.admin_assign_id) !== theLog.admin_assign_id
            ) {
                fd.append("admin_assign_id", Number(formData.admin_assign_id));
            }

            await editLog(fd);
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

    const editLog = async (fd) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/tracking-log/${formData.id}`,
                fd
            );

            if (status === 200) {
                showAlert(true, "success", "لاگ باموفقیت ویرایش شد");
                router.push(
                    `/tkpanel/multiSessionsList/logs/${
                        type === "student"
                            ? formData.user_id
                            : formData.teacher_id
                    }?type=${type}`
                );
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

    useEffect(() => {
        // Filling date and time for inputs
        let updated = {
            next_tracking_time_status: statusList.find(
                (sts) => sts.id === Number(theLog.status)
            )?.next_tracking_time,
        };

        if (theLog.next_tracking_time) {
            let shamsi_date = moment
                .from(
                    `${theLog.next_tracking_time?.substring(0, 10)}`,
                    "en",
                    "YYYY/MM/DD"
                )
                .locale("fa")
                .format("YYYY/MM/DD");

            updated = {
                ...updated,
                next_tracking_date: {
                    year: Number(shamsi_date?.substring(0, 4)),
                    month: Number(shamsi_date?.substring(5, 7)),
                    day: Number(shamsi_date?.substring(8, 10)),
                },
                next_tracking_time: theLog.next_tracking_time?.substring(
                    11,
                    16
                ),
            };
        } else {
            updated = {
                ...updated,
                next_tracking_date: null,
                next_tracking_time: "00:00",
            };
        }

        setFormData({
            ...formData,
            ...updated,
        });
    }, []);

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title="ویرایش لاگ">
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
                                    value={formData.user_name || ""}
                                    disabled
                                />
                            </div>
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
                                    value={formData.teacher_name || ""}
                                    disabled
                                />
                            </div>
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
                            value={formData.desc}
                        />
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="admin_assign_id"
                            className="form__label"
                        >
                            ادمین :
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
                        {loading ? "در حال انجام ..." : "ویرایش لاگ"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default EditLog;
