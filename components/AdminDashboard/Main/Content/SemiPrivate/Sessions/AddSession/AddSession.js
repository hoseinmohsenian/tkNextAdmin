import { useState, useEffect } from "react";
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
    const [formData, setFormData] = useState(theClass.session);
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
    moment.locale("fa", { useGregorianParser: true });

    const handleRouter = () => {
        router.push("/tkpanel/semi-private-admin");
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const addNewRow = () => {
        let newRow = ["title", "time", "day", "hour"].reduce(
            (acc, curr) => ((acc[curr] = ""), acc),
            {}
        );
        newRow["time"] = 60;
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
        updated[rowInd] = { ...updated[rowInd], day: value };
        setFormData(() => updated);
    };

    const deleteRow = (rowInd) => {
        let updated = [...formData];
        updated = updated.filter((_, ind) => rowInd !== ind);
        setFormData(() => updated);
    };

    const addSession = async (body, rowInd) => {
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
                const {
                    data: { id },
                } = await res.json();
                let updated = [...formData];
                updated[rowInd] = {
                    ...updated[rowInd],
                    id,
                };
                setFormData(() => updated);
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
            if (!isMinuteValid(formData[rowInd].hour)) {
                showAlert(true, "danger", "دقیقه باید ۳۰ یا ۰ باشد");
            } else {
                let body = {};
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
                if (
                    formData[rowInd].title &&
                    formData[rowInd].title !== theClass.session[rowInd].title
                ) {
                    body = { ...body, title: formData[rowInd].title };
                }
                if (
                    Number(formData[rowInd].time) !==
                    theClass.session[rowInd].time
                ) {
                    body = { ...body, time: Number(formData[rowInd].time) };
                }
                date = `${date} ${formData[rowInd].hour}:00`;
                if (date !== theClass.session[rowInd].date) {
                    body = { ...body, date };
                }
                await editSession(body, id);
            }
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const onAddHandler = async (rowInd) => {
        if (!isEmpty(rowInd)) {
            if (!isMinuteValid(formData[rowInd].hour)) {
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
                    date: `${date} ${formData[rowInd].hour}:00`,
                };
                await addSession(body, rowInd);
            }
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const isMinuteValid = (time) => {
        return Number(time.substring(3, 5)) % 30 === 0;
    };

    const isEmpty = (rowInd) => {
        if (
            !formData[rowInd]?.title ||
            !formData[rowInd]?.time ||
            !formData[rowInd]?.day.year ||
            !formData[rowInd]?.hour
        ) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        // Filling date for inputs
        let updated = [...formData];
        for (let i = 0; i < formData.length; i++) {
            let shamsi_date = moment
                .from(
                    `${formData[i].date.substring(0, 10)}`,
                    "en",
                    "YYYY/MM/DD"
                )
                .locale("fa")
                .format("YYYY/MM/DD");

            updated[i] = {
                ...updated[i],
                day: {
                    year: Number(shamsi_date?.substring(0, 4)),
                    month: Number(shamsi_date?.substring(5, 7)),
                    day: Number(shamsi_date?.substring(8, 10)),
                },
                hour: formData[i].date?.substring(11, 16),
            };
        }
        setFormData(() => updated);
    }, []);

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
                                                            handleOnChange(e, i)
                                                        }
                                                        value={item?.title}
                                                        required
                                                        placeholder="عنوان"
                                                        spellCheck={false}
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
                                                    مدت :
                                                </label>
                                                <div className="form-control">
                                                    <select
                                                        name="time"
                                                        id="time"
                                                        className="form__input input-select"
                                                        onChange={(e) =>
                                                            handleOnChange(e, i)
                                                        }
                                                        value={item?.time}
                                                        required
                                                    >
                                                        <option value={60}>
                                                            60
                                                        </option>
                                                        <option value={90}>
                                                            90
                                                        </option>
                                                        <option value={120}>
                                                            120
                                                        </option>
                                                    </select>
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
                                                        value={item.day}
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
                                                    htmlFor="hour"
                                                    className={`form__label ${styles["session-label"]}`}
                                                >
                                                    ساعت :
                                                </label>
                                                <div className="form-control">
                                                    <input
                                                        type="time"
                                                        name="hour"
                                                        id="hour"
                                                        className={`form__input form__input-time ${styles["form__input-time"]}`}
                                                        onChange={(e) =>
                                                            handleOnChange(e, i)
                                                        }
                                                        value={item?.hour || ""}
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
                        {loading ? "در حال انجام ..." : "لیست کلاس ها"}
                    </button>
                </div>
            </Box>
        </div>
    );
}

export default AddSessions;
