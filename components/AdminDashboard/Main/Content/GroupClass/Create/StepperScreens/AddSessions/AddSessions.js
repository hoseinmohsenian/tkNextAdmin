import { useState } from "react";
import styles from "./AddSessions.module.css";
import Box from "../../../../Elements/Box/Box";
import Alert from "../../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddSharp } from "react-icons/io5";
import moment from "jalali-moment";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { TimePicker } from "antd";
import API from "../../../../../../../../api";

function AddSessions(props) {
    const { showAlert, alertData, formData, setFormData } = props;
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        let emptySessionInput = false;

        // Checking whether or not all the sessions inputs are filled
        for (let i = 0; i < formData.session.length; i++) {
            if (isEmpty(i)) {
                emptySessionInput = true;
                return;
            }
        }

        if (emptySessionInput) {
            showAlert(true, "danger", "لطفا همه فیلدها را تکمیل کنید");
        } else {
            let res = [];
            for (let i = 0; i < formData.session.length; i++) {
                let date = moment
                    .from(
                        `${formData.session[i].date.year}/${formData.session[i].date.month}/${formData.session[i].date.day}`,
                        "fa",
                        "YYYY/MM/DD"
                    )
                    .locale("en")
                    .format("YYYY/MM/DD")
                    .replace("/", "-")
                    .replace("/", "-");
                let newItem = {
                    title: formData.session[i].title,
                    desc: formData.session[i].desc,
                    date: `${date}T${formData.session[i].time}:00`,
                };
                res.push(newItem);
            }
            await addSession({ data: { ...res } });
        }
    };

    const addNewRow = () => {
        let newRow = ["title", "desc", "time", "date"].reduce(
            (acc, curr) => ((acc[curr] = ""), acc),
            {}
        );
        newRow = { ...newRow, time: "00:00" };
        setFormData({
            ...formData,
            session: [...formData?.session, newRow],
        });
    };

    const handleOnChange = (value, rowInd, name) => {
        let updated = [...formData?.session];
        updated[rowInd] = { ...updated[rowInd], [name]: value };
        setFormData({
            ...formData,
            session: updated,
        });
    };

    const deleteRow = (rowInd) => {
        let updated = [...formData?.session];
        updated = updated.filter((item, ind) => rowInd !== ind);
        setFormData({
            ...formData,
            session: updated,
        });
    };

    const addSession = async (body) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/group-class/session/${formData.id}`,
                JSON.stringify(body)
            );

            if (status === 200) {
                let message = "جلسات باموفقیت ثبت شد";
                showAlert(true, "success", message);
                router.push("/tkpanel/groupClass");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding sessions", error);
        }
        setLoading(false);
    };

    const isEmpty = (rowInd) => {
        if (
            !formData?.session[rowInd]?.title ||
            !formData?.session[rowInd]?.desc ||
            !formData?.session[rowInd]?.time ||
            !formData?.session[rowInd]?.date
        ) {
            return true;
        }
        return false;
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title="جلسات کلاس گروهی">
                <div className="form">
                    {formData?.session?.map((item, i) => (
                        <div key={i}>
                            <div className={styles["session-header"]}>
                                <h3 className={styles["session-title"]}>
                                    جلسه {i + 1} :
                                </h3>
                                <div
                                    className={
                                        styles["session-row-btn-wrapper"]
                                    }
                                >
                                    <button
                                        className={`danger ${styles["session-btn"]}`}
                                        type="button"
                                        onClick={() => deleteRow(i)}
                                        title="حذف"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                            <div className={styles["session-row"]}>
                                <div className={styles["inputs-container"]}>
                                    <div className="row">
                                        <div
                                            className={`col-md-6 ${styles["session-col"]}`}
                                        >
                                            <div
                                                className={`input-wrapper ${styles["session-input-wrapper"]}`}
                                            >
                                                <label
                                                    htmlFor="title"
                                                    className={`form__label ${styles["session-label"]}`}
                                                >
                                                    عنوان :
                                                </label>
                                                <div className="form-control">
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        id="title"
                                                        className="form__input"
                                                        onChange={(e) =>
                                                            handleOnChange(
                                                                e.target.value,
                                                                i,
                                                                e.target.name
                                                            )
                                                        }
                                                        value={item?.title}
                                                        required
                                                        placeholder="عنوان"
                                                        spellCheck={false}
                                                        autoComplete="off"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`col-md-6 ${styles["session-col"]}`}
                                        >
                                            <div
                                                className={`input-wrapper ${styles["session-input-wrapper"]}`}
                                            >
                                                <label
                                                    htmlFor="desc"
                                                    className={`form__label ${styles["session-label"]}`}
                                                >
                                                    توضیحات :
                                                </label>
                                                <div className="form-control">
                                                    <input
                                                        type="text"
                                                        name="desc"
                                                        id="desc"
                                                        className="form__input"
                                                        onChange={(e) =>
                                                            handleOnChange(
                                                                e.target.value,
                                                                i,
                                                                e.target.name
                                                            )
                                                        }
                                                        value={item?.desc}
                                                        spellCheck={false}
                                                        autoComplete="off"
                                                        required
                                                        placeholder="توضیحات"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div
                                            className={`col-md-6 ${styles["session-col"]}`}
                                        >
                                            <div
                                                className={`input-wrapper ${styles["session-input-wrapper"]}`}
                                            >
                                                <label
                                                    htmlFor="date"
                                                    className={`form__label ${styles["session-label"]}`}
                                                >
                                                    تاریخ :
                                                </label>
                                                <div className="form-control">
                                                    <DatePicker
                                                        value={item.date}
                                                        onChange={(date) =>
                                                            handleOnChange(
                                                                date,
                                                                i,
                                                                "date"
                                                            )
                                                        }
                                                        shouldHighlightWeekends
                                                        locale="fa"
                                                        wrapperClassName="date-input-wrapper"
                                                        inputClassName="date-input"
                                                        colorPrimary="#545cd8"
                                                        minimumDate={{
                                                            year: moment().year(),
                                                            month: Number(
                                                                moment().format(
                                                                    "M"
                                                                )
                                                            ),
                                                            day: Number(
                                                                moment().format(
                                                                    "DD"
                                                                )
                                                            ),
                                                        }}
                                                        inputPlaceholder="انتخاب کنید"
                                                        calendarPopperPosition="bottom"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`col-md-6 ${styles["session-col"]}`}
                                        >
                                            <div
                                                className={`input-wrapper ${styles["session-input-wrapper"]}`}
                                            >
                                                <label
                                                    htmlFor="time"
                                                    className={`form__label ${styles["session-label"]}`}
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
                                                            handleOnChange(
                                                                moment(
                                                                    value
                                                                ).format(
                                                                    "HH:mm"
                                                                ),
                                                                i,
                                                                "time"
                                                            )
                                                        }
                                                        value={moment(
                                                            item.time || "",
                                                            "HH:mm"
                                                        )}
                                                        className="time-picker"
                                                        popupClassName="popup-time-picker"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className={styles["session-add-btn-wrapper"]}>
                        <button
                            className={`success ${styles["session-add-btn"]}`}
                            type="button"
                            onClick={addNewRow}
                        >
                            اضافه کردن جلسه
                            <span className={styles["session-add-btn-icon"]}>
                                <IoAddSharp />
                            </span>
                        </button>
                    </div>

                    <button
                        type="button"
                        className="btn primary"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? "در حال انجام ..." : "ثبت جلسات"}
                    </button>
                </div>
            </Box>
        </div>
    );
}

export default AddSessions;
