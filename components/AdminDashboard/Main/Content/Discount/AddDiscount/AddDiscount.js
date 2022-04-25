import { useState } from "react";
import styles from "./AddDiscount.module.css";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import moment from "jalali-moment";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import Box from "../../Elements/Box/Box";

function AddDiscount({ token, courses }) {
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
        type: 1,
        course_id: 1,
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
            Number(formData.course_id) !== 0 &&
            Number(formData.number) !== 0 &&
            formData.start_at.year &&
            formData.expired_at.year
        ) {
            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("number", Number(formData.number));
            fd.append("course_id", Number(formData.course_id));
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

            if (Number(formData.type)) {
                fd.append("type", Number(formData.type));
            }
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
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
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
                showAlert(true, "success", "کوپن تخفیف ثبت شد");
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

    return (
        <form onSubmit={handleSubmit}>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title="کوپن تخفیف جدید">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="name" className="form__label">
                            عنوان :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="number" className="form__label">
                            تعداد :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="number"
                                name="number"
                                id="number"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="course_id" className="form__label">
                            کورس :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="course_id"
                                id="course_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.course_id}
                                required
                            >
                                {courses?.map((course) => (
                                    <option key={course?.id} value={course?.id}>
                                        {course?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="type" className="form__label">
                            تایپ :
                        </label>
                        <div className="form-control">
                            <select
                                name="type"
                                id="type"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.type}
                            >
                                <option value={0}>همه</option>
                                <option value={1}>کلاس خصوصی</option>
                                <option value={2}>۵ جلسه</option>
                                <option value={3}>۱۰ جلسه</option>
                                <option value={4}>۱۶ جلسه</option>
                                <option value={5}>اولین خرید</option>
                            </select>
                        </div>
                    </div>
                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="start_at"
                                    className="form__label"
                                >
                                    تاریخ شروع :
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
                                        inputPlaceholder="انتخاب کنید"
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
                                    تاریخ انقضا :
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
                                            year: moment().year(),
                                            month: Number(moment().format("M")),
                                            day: Number(moment().format("DD")),
                                        }}
                                        inputPlaceholder="انتخاب کنید"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className={`col-sm-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="discount_type"
                                    className={`form__label`}
                                >
                                    نوع تخفیف :
                                    <span className="form__star">*</span>
                                </label>
                                <div className="form-control form-control-radio">
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="value"
                                            className="radio-title"
                                        >
                                            حجمی
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
                                            درصدی
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
                                    وضعیت :<span className="form__star">*</span>
                                </label>
                                <div className="form-control form-control-radio">
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="active"
                                            className="radio-title"
                                        >
                                            فعال
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
                                            غیرفعال
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
                                <label htmlFor="value" className="form__label">
                                    مبلغ تخفیف :
                                </label>
                                <div className="form-control">
                                    <input
                                        type="number"
                                        name="value"
                                        id="value"
                                        className="form__input form__input--ltr"
                                        onChange={handleOnChange}
                                        spellCheck={false}
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
                                    className="form__label"
                                >
                                    درصد تخفیف :
                                </label>
                                <div className="form-control">
                                    <input
                                        type="number"
                                        name="percent"
                                        id="percent"
                                        className="form__input form__input--ltr"
                                        onChange={handleOnChange}
                                        spellCheck={false}
                                        disabled={
                                            Number(formData.discount_type) === 1
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label htmlFor="min" className="form__label">
                                    حداقل قیمت :
                                </label>
                                <div className="form-control">
                                    <input
                                        type="number"
                                        name="min"
                                        id="min"
                                        className="form__input form__input--ltr"
                                        onChange={handleOnChange}
                                        spellCheck={false}
                                        disabled={
                                            Number(formData.discount_type) === 0
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6`}>
                            <div className="input-wrapper">
                                <label htmlFor="max" className="form__label">
                                    حداکثر قیمت :
                                </label>
                                <div className="form-control">
                                    <input
                                        type="number"
                                        name="max"
                                        id="max"
                                        className="form__input form__input--ltr"
                                        onChange={handleOnChange}
                                        spellCheck={false}
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
                        {loading ? "در حال انجام ..." : "ایجاد کوپن تخفیف"}
                    </button>
                </div>
            </Box>
        </form>
    );
}

export default AddDiscount;