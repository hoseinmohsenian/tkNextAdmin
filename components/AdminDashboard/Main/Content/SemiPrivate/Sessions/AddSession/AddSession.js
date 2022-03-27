import { useState } from "react";
import styles from "./AddSessions.module.css";
import Box from "../../../Elements/Box/Box";
import Alert from "../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import moment from "jalali-moment";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { BASE_URL } from "../../../../../../../constants";

function AddSessions({ token, id, theClass }) {
    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(
        Array(formData.length).fill(false)
    );
    const router = useRouter();
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });

    const handleRouter = () => {
        router.push("/tkpanel/semi-private-admin");
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const addNewRow = () => {
        let newRow = ["title", "time", "date"].reduce(
            (acc, curr) => ((acc[curr] = ""), acc),
            {}
        );
        setFormData([...formData, newRow]);
    };

    const handleOnChange = (e, rowInd) => {
        const name = e.target.name;
        let updated = [...formData];
        updated[rowInd] = { ...updated[rowInd], [name]: e.target.value };
        setFormData(() => updated);
    };

    const dateOnChange = (value, rowInd) => {
        let updated = [...formData];
        updated[rowInd] = { ...updated[rowInd], date: value };
        setFormData(() => updated);
    };

    const deleteRow = (rowInd) => {
        let updated = [...formData];
        updated = updated.filter((_, ind) => rowInd !== ind);
        setFormData(() => updated);
    };

    const addSession = async (body) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/semi-private/session/${id}`,
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.ok) {
                // **************************** Adding the id to formData
                let message = "جلسه جدید باموفقیت ثبت شد";
                showAlert(true, "success", message);
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error adding new session", error);
        }
    };

    const editSession = async (body, session_id) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/semi-private/session/edit/${session_id}`,
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.ok) {
                let message = "این جلسه ویرایش شد";
                showAlert(true, "success", message);
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error editing session", error);
        }
    };

    const onEditHandler = async (rowInd, id) => {
        if (!isEmpty(rowInd)) {
            if (!isMinuteValid(formData[rowInd].time)) {
                showAlert(true, "danger", "دقیقه باید ۳۰ یا ۰ باشد");
            } else {
                await editSession(rowInd, id);
            }
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const onAddHandler = async (rowInd) => {
        if (!isEmpty(rowInd)) {
            if (!isMinuteValid(formData[rowInd].time)) {
                showAlert(true, "danger", "دقیقه باید ۳۰ یا ۰ باشد");
            } else {
                let date = moment
                    .from(
                        `${formData[rowInd].day.year}/${formData[rowInd].day.month}/${formData[rowInd].day.day}`,
                        "fa",
                        "YYYY/MM/DD"
                    )
                    .locale("en")
                    .format("YYYY/MM/DD")
                    .replace("/", "-")
                    .replace("/", "-");
                let body = {
                    title: formData[rowInd].title,
                    time: Number(formData[rowInd].time),
                    date: `${date} ${formData[rowInd].time}:00`,
                };
                await addSession(body, id);
            }
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const isEmpty = (rowInd) => {
        if (
            !formData[rowInd]?.title ||
            !formData[rowInd]?.time ||
            !formData[rowInd]?.date
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
                envoker={addSession || editSession}
            />

            <Box title="جلسات کلاس نیمه خصوصی">
                <div className="form">
                    {formData?.map((item, i) => (
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
                                    {!item.id && (
                                        <button
                                            className={`danger ${styles["session-btn"]}`}
                                            type="button"
                                            onClick={() => deleteRow(i)}
                                            title="حذف"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    )}
                                    {item?.id ? (
                                        <button
                                            type="button"
                                            className={`primary ${styles["session-btn"]}`}
                                            onClick={() =>
                                                onEditHandler(i, item?.id)
                                            }
                                            title="ویرایش"
                                            disabled={loadings[i]}
                                        >
                                            <MdEdit />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className={`primary ${styles["session-btn"]}`}
                                            onClick={() => onAddHandler(i)}
                                            title="ثبت"
                                            disabled={loadings[i]}
                                        >
                                            <FaCheck />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className={styles["session-row"]}>
                                <div className={styles["inputs-container"]}>
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
                                                    handleOnChange(e, i)
                                                }
                                                value={item?.title}
                                                required
                                                placeholder="عنوان"
                                                spellCheck={false}
                                                autoComplete="off"
                                            />
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
                                                            dateOnChange(
                                                                date,
                                                                i
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
                                                    <input
                                                        type="time"
                                                        name="time"
                                                        id="time"
                                                        className={`form__input form__input-time ${styles["form__input-time"]}`}
                                                        onChange={(e) =>
                                                            handleOnChange(e, i)
                                                        }
                                                        value={item?.time}
                                                        spellCheck={false}
                                                        required
                                                        placeholder="ساعت"
                                                        pattern="[0-9]{2}:[0-9]{2}"
                                                        step="1800"
                                                        min="00:00"
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
                        onClick={handleRouter}
                    >
                        {loading ? "در حال انجام ..." : "ثبت جلسات"}
                    </button>
                </div>
            </Box>
        </div>
    );
}

export default AddSessions;
