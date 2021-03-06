import { useState } from "react";
import styles from "./AddDiscount.module.css";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import moment from "jalali-moment";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import Box from "../../Elements/Box/Box";

function AddDiscount({ token }) {
    const [formData, setFormData] = useState({
        name: "",
        percent: "",
        value: "",
        number: "",
        start_at: "",
        expired_at: "",
        min: "",
        max: "",
        active_status: 1,
        type: 0,
        discount_type: 1,
    });
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    moment.locale("fa", { useGregorianParser: true });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            formData.name.trim() &&
            Number(formData.number) !== 0 &&
            formData.start_at.year &&
            formData.expired_at.year
        ) {
            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("number", Number(formData.number));
            fd.append("active_status", Number(formData.active_status));
            let date = moment
                .from(
                    `${formData.start_at?.year}/${formData.start_at?.month}/${formData.start_at?.day}`,
                    "fa",
                    "YYYY/MM/DD"
                )
                .locale("en")
                .format("YYYY/MM/DD")
                .replace("/", "-")
                .replace("/", "-");
            let start_at = `${date} 00:00:00`;
            fd.append("start_at", start_at);
            date = moment
                .from(
                    `${formData.expired_at?.year}/${formData.expired_at?.month}/${formData.expired_at?.day}`,
                    "fa",
                    "YYYY/MM/DD"
                )
                .locale("en")
                .format("YYYY/MM/DD")
                .replace("/", "-")
                .replace("/", "-");
            let expired_at = `${date} 00:00:00`;
            fd.append("expired_at", expired_at);
            fd.append("type", Number(formData.type));

            if (Number(formData.discount_type) === 1) {
                if (Number(formData.min)) {
                    fd.append("min", Number(formData.min));
                }
                if (Number(formData.value)) {
                    fd.append("value", Number(formData.value));
                }
            } else {
                if (Number(formData.max)) {
                    fd.append("max", Number(formData.max));
                }
                if (Number(formData.percent)) {
                    fd.append("percent", Number(formData.percent));
                }
            }

            await addDiscount(fd);
        } else {
            showAlert(true, "danger", "???????? ???????????? ???? ?????????? ????????");
        }
    };

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        let value = type === "checkbox" ? e.target.checked : e.target.value;

        // Only English letters for "name" input
        // if (name === "name") {
        //     value = e.target.value.replace(/[^a-z]/gi, "");
        // }
        setFormData({ ...formData, [name]: value });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const addDiscount = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/discount`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "success", "???????? ?????????? ?????? ????");
                router.push("/tkpanel/copens");
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error adding a discount", error);
        }
    };

    function handleKeyPress(e) {
        var key = e.key;
        // var regex = /[A-Za-z0-9]|\./;
        // if (!regex.test(key)) {
        //     e.preventDefault();
        // }
        let condition =
            (key >= "0" && key <= "9") ||
            (key.toLowerCase() >= "a" && key.toLowerCase() <= "z") ||
            ["+", "(", ")", "-", "_", "@"].includes(key);
        if (!condition) {
            e.preventDefault();
        }
    }

    function makeid(min, max) {
        let difference = max - min;
        let rand = Math.floor(Math.random() * difference) + min;

        var result = "";
        var characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < rand; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title="???????? ?????????? ????????">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="name" className="form__label">
                            ?????????? :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                value={formData.name}
                                spellCheck={false}
                                required
                                onKeyDown={(e) => handleKeyPress(e)}
                            />
                        </div>
                        <button
                            className={`action-btn primary ${styles["discount-btn"]}`}
                            type="button"
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    name: makeid(8, 16),
                                });
                            }}
                        >
                            ?????????? ???? ??????????
                        </button>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="number" className="form__label">
                            ?????????? :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="number"
                                name="number"
                                id="number"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                spellCheck={false}
                                autoComplete="off"
                                required
                            />
                        </div>
                    </div>
                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="start_at"
                                    className="form__label"
                                >
                                    ?????????? ???????? :
                                    <span className="form__star">*</span>
                                </label>
                                <div className="form-control">
                                    <DatePicker
                                        value={formData.start_at}
                                        onChange={(date) =>
                                            setFormData({
                                                ...formData,
                                                start_at: date,
                                            })
                                        }
                                        shouldHighlightWeekends
                                        locale="fa"
                                        wrapperClassName="date-input-wrapper"
                                        inputClassName="date-input"
                                        colorPrimary="#545cd8"
                                        minimumDate={{
                                            year: moment().year(),
                                            month: Number(moment().format("M")),
                                            day: Number(moment().format("DD")),
                                        }}
                                        inputPlaceholder="???????????? ????????"
                                        calendarPopperPosition="bottom"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="expired_at"
                                    className={`form__label`}
                                >
                                    ?????????? ?????????? :
                                    <span className="form__star">*</span>
                                </label>
                                <div className="form-control">
                                    <DatePicker
                                        value={formData.expired_at}
                                        onChange={(date) =>
                                            setFormData({
                                                ...formData,
                                                expired_at: date,
                                            })
                                        }
                                        shouldHighlightWeekends
                                        locale="fa"
                                        wrapperClassName="date-input-wrapper"
                                        inputClassName="date-input"
                                        colorPrimary="#545cd8"
                                        minimumDate={{
                                            year:
                                                formData.start_at?.year ||
                                                moment().year(),
                                            month:
                                                formData.start_at?.month ||
                                                Number(moment().format("M")),
                                            day:
                                                formData.start_at?.day ||
                                                Number(moment().format("DD")),
                                        }}
                                        inputPlaceholder="???????????? ????????"
                                        calendarPopperPosition="bottom"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="type" className="form__label">
                            ?????? :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="type"
                                id="type"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.type}
                            >
                                <option value={0}>??????</option>
                                <option value={1}>???????? ??????????????</option>
                                <option value={2}>???????? ??????????</option>
                                <option value={3}>?? ????????</option>
                                <option value={4}>???? ????????</option>
                                <option value={5}>???? ????????</option>
                                <option value={6}>?????????? ????????</option>
                            </select>
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className={`col-sm-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="discount_type"
                                    className={`form__label`}
                                >
                                    ?????? ?????????? :
                                    <span className="form__star">*</span>
                                </label>
                                <div className="form-control form-control-radio">
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="value"
                                            className="radio-title"
                                        >
                                            ????????
                                        </label>
                                        <input
                                            type="radio"
                                            name="discount_type"
                                            onChange={handleOnChange}
                                            value={1}
                                            checked={
                                                Number(
                                                    formData.discount_type
                                                ) === 1
                                            }
                                            id="value"
                                        />
                                    </div>
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="percent"
                                            className="radio-title"
                                        >
                                            ??????????
                                        </label>
                                        <input
                                            type="radio"
                                            name="discount_type"
                                            onChange={handleOnChange}
                                            value={0}
                                            checked={
                                                Number(
                                                    formData.discount_type
                                                ) === 0
                                            }
                                            id="percent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="active_status"
                                    className={`form__label`}
                                >
                                    ?????????? :<span className="form__star">*</span>
                                </label>
                                <div className="form-control form-control-radio">
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="active"
                                            className="radio-title"
                                        >
                                            ????????
                                        </label>
                                        <input
                                            type="radio"
                                            name="active_status"
                                            onChange={handleOnChange}
                                            value={1}
                                            checked={
                                                Number(
                                                    formData.active_status
                                                ) === 1
                                            }
                                            id="active"
                                        />
                                    </div>
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="inactive"
                                            className="radio-title"
                                        >
                                            ??????????????
                                        </label>
                                        <input
                                            type="radio"
                                            name="active_status"
                                            onChange={handleOnChange}
                                            value={0}
                                            checked={
                                                Number(
                                                    formData.active_status
                                                ) === 0
                                            }
                                            id="inactive"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="value"
                                    className={`form__label ${
                                        Number(formData.discount_type) === 0
                                            ? "form__label--disabled"
                                            : undefined
                                    }`}
                                >
                                    ???????? ?????????? :
                                </label>
                                <div className="form-control">
                                    <input
                                        type="number"
                                        name="value"
                                        id="value"
                                        className={`form__input form__input--ltr`}
                                        onChange={handleOnChange}
                                        spellCheck={false}
                                        autoComplete="off"
                                        disabled={
                                            Number(formData.discount_type) === 0
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="percent"
                                    className={`form__label ${
                                        Number(formData.discount_type) === 1
                                            ? "form__label--disabled"
                                            : undefined
                                    }`}
                                >
                                    ???????? ?????????? :
                                </label>
                                <div className="form-control">
                                    <select
                                        name="percent"
                                        id="percent"
                                        className={`form__input input-select???`}
                                        onChange={handleOnChange}
                                        value={formData.percent || ""}
                                        disabled={
                                            Number(formData.discount_type) === 1
                                        }
                                    >
                                        {Array(20)
                                            .fill(0)
                                            .map((_, i) => (
                                                <option
                                                    key={i}
                                                    value={(i + 1) * 5}
                                                >
                                                    {(i + 1) * 5}%
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="min"
                                    className={`form__label ${
                                        Number(formData.discount_type) === 0
                                            ? "form__label--disabled"
                                            : undefined
                                    }`}
                                >
                                    ?????????? ???????? :
                                </label>
                                <div className="form-control">
                                    <input
                                        type="number"
                                        name="min"
                                        id="min"
                                        className={`form__input form__input--ltr`}
                                        onChange={handleOnChange}
                                        spellCheck={false}
                                        autoComplete="off"
                                        disabled={
                                            Number(formData.discount_type) === 0
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="max"
                                    className={`form__label ${
                                        Number(formData.discount_type) === 1
                                            ? "form__label--disabled"
                                            : undefined
                                    }`}
                                >
                                    ???????????? ???????? :
                                </label>
                                <div className="form-control">
                                    <input
                                        type="number"
                                        name="max"
                                        id="max"
                                        className={`form__input form__input--ltr`}
                                        onChange={handleOnChange}
                                        spellCheck={false}
                                        autoComplete="off"
                                        disabled={
                                            Number(formData.discount_type) === 1
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "???? ?????? ?????????? ..." : "?????????? ???????? ??????????"}
                    </button>
                </div>
            </Box>
        </form>
    );
}

export default AddDiscount;
