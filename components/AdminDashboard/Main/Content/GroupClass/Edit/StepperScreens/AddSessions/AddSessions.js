import { useEffect, useState } from "react";
import styles from "../../../Create/StepperScreens/AddSessions/AddSessions.module.css";
import Box from "../../../../Elements/Box/Box";
import Alert from "../../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import moment from "jalali-moment";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { BASE_URL } from "../../../../../../../../constants";
import TimePicker from "../../../../../../../TimePicker/TimePicker";

function AddSessions(props) {
    const { token, showAlert, alertData, formData, setFormData, fetchedClass } =
        props;
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(
        Array(formData.session?.length).fill(false)
    );
    const router = useRouter();

    const formatNumber = (number) =>
        number.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });

    const handleSubmit = async () => {
        let emptySessionInput = false;

        // Checking whether or not all the sessions inputs are filled
        for (let i = 0; i < formData.session.length; i++) {
            if (isEmpty(i)) {
                emptySessionInput = true;
                break;
            }
        }

        if (emptySessionInput) {
            showAlert(true, "danger", "لطفا همه فیلدها را تکمیل کنید");
        } else {
            let res = [];
            for (let i = 0; i < formData.session.length; i++) {
                if (!formData.session[i].id) {
                    let date = moment
                        .from(
                            `${formData.session[i].day.year}/${formData.session[i].day.month}/${formData.session[i].day.day}`,
                            "fa",
                            "YYYY/MM/DD"
                        )
                        .locale("en")
                        .format("YYYY/MM/DD")
                        .replace("/", "-")
                        .replace("/", "-");
                    let time = `${formatNumber(
                        formData.session[i].time.hour
                    )}:${formatNumber(formData.session[i].time.min)}`;
                    let newItem = {
                        title: formData.session[i].title,
                        desc: formData.session[i].desc,
                        date: `${date}T${time}:00`,
                    };
                    res.push(newItem);
                }
            }
            await addSession({ data: { ...res } });
        }
    };

    const addNewRow = (currLen) => {
        let newRow = ["title", "desc", "time", "date"].reduce(
            (acc, curr) => ((acc[curr] = ""), acc),
            {}
        );
        newRow = {
            ...newRow,
            title: `جلسه ${currLen + 1}`,
            time: { hour: 0, min: 0 },
        };
        return newRow;
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
            const res = await fetch(
                `${BASE_URL}/admin/group-class/session/${formData.id}`,
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
                let message = "جلسات باموفقیت ثبت شد";
                showAlert(true, "success", message);
                router.push("/tkpanel/groupClass");
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
            console.log("Error adding sessions", error);
        }
    };

    const editSession = async (i, id) => {
        let body = {};
        let date = moment
            .from(
                `${formData.session[i].day.year}/${formData.session[i].day.month}/${formData.session[i].day.day}`,
                "fa",
                "YYYY/MM/DD"
            )
            .locale("en")
            .format("YYYY/MM/DD")
            .replace("/", "-")
            .replace("/", "-");
        let time = `${formatNumber(
            formData.session[i].time.hour
        )}:${formatNumber(formData.session[i].time.min)}`;
        date = `${date} ${time}:00`;
        if (fetchedClass.session[i].date.replace(" ", "T") !== date) {
            body = { ...body, date };
        }
        if (fetchedClass.session[i].title !== formData.session[i].title) {
            body = { ...body, title: formData.session[i].title };
        }
        if (fetchedClass.session[i].desc !== formData.session[i].desc) {
            body = { ...body, desc: formData.session[i].desc };
        }
        try {
            loadingHandler(i, true);

            const res = await fetch(
                `${BASE_URL}/admin/group-class/session/edit/${id}`,
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = "این جلسه ویرایش شد";
                showAlert(true, "success", message);
            }
            loadingHandler(i, false);
        } catch (error) {
            console.log("Error editing session", error);
        }
    };

    const onEditHandler = async (rowInd, id) => {
        if (!isEmpty(rowInd)) {
            await editSession(rowInd, id);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const isEmpty = (rowInd) => {
        if (
            !formData?.session[rowInd]?.title ||
            !formData?.session[rowInd]?.desc ||
            !formData?.session[rowInd]?.time ||
            !formData?.session[rowInd]?.day
        ) {
            return true;
        }
        return false;
    };

    const loadingHandler = (ind, value) => {
        let temp = [...loadings];
        temp[ind] = value;
        setLoadings(() => temp);
    };

    useEffect(() => {
        // Filling date for inputs
        let updated = [...formData?.session];
        for (let i = 0; i < formData.session.length; i++) {
            let shamsi_date = moment
                .from(
                    `${formData.session[i].date.substring(0, 10)}`,
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
                time: {
                    hour: Number(formData.session[i].date?.substring(11, 13)),
                    min: Number(formData.session[i].date?.substring(14, 16)),
                },
            };
        }
        setFormData({
            ...formData,
            session: updated,
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
                                    {item?.id && (
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
                                                            handleOnChange(
                                                                e.target.value,
                                                                i,
                                                                e.target.name
                                                            )
                                                        }
                                                        value={
                                                            item?.title || ""
                                                        }
                                                        required
                                                        placeholder="عنوان"
                                                        spellCheck={false}
                                                        autoComplete="off"
                                                        disabled={loadings[i]}
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
                                                        value={item?.desc || ""}
                                                        spellCheck={false}
                                                        autoComplete="off"
                                                        required
                                                        placeholder="توضیحات"
                                                        disabled={loadings[i]}
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
                                                        value={item.day}
                                                        onChange={(date) =>
                                                            handleOnChange(
                                                                date,
                                                                i,
                                                                "day"
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
                                                        disabled={loadings[i]}
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
                                                <div className={`form-control`}>
                                                    <TimePicker
                                                        value={item.time}
                                                        onChange={(value) => {
                                                            handleOnChange(
                                                                value,
                                                                i,
                                                                "time"
                                                            );
                                                        }}
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
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    session: [
                                        ...formData?.session,
                                        addNewRow(formData?.session?.length),
                                    ],
                                });
                            }}
                            disabled={
                                formData.session?.length ===
                                Number(formData.class_number)
                            }
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
