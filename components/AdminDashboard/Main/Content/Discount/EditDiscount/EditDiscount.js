import { useEffect, useState } from "react";
import styles from "./EditDiscount.module.css";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import moment from "jalali-moment";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import Box from "../../Elements/Box/Box";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";
import {
    checkValidPriceKeys,
    getFormattedPrice,
    getUnformattedPrice,
} from "../../../../../../utils/priceFormat";

function EditDiscount({ token, discount }) {
    const [formData, setFormData] = useState({
        ...discount,
        discount_type: discount.value ? 1 : 0,
        start_at: null,
        expired_at: null,
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
            formData.desc.trim() &&
            formData.name.trim() &&
            Number(formData.number) !== 0 &&
            formData.start_at.year &&
            formData.expired_at.year
        ) {
            const fd = new FormData();
            if (
                formData.number &&
                Number(formData.number) !== discount.number
            ) {
                fd.append("number", Number(formData.number));
            }
            if (
                formData.active_status &&
                Number(formData.active_status) !== discount.active_status
            ) {
                fd.append("active_status", Number(formData.active_status));
            }

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
            if (start_at && start_at !== discount.start_at) {
                fd.append("start_at", start_at);
            }
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
            if (expired_at && expired_at !== discount.expired_at) {
                fd.append("expired_at", expired_at);
            }

            await editDiscount(fd);
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

    const editDiscount = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/discount/${formData.id}`,
                {
                    method: "POST",
                    body: fd,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(true, "success", "کوپن تخفیف ویرایش شد");
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
            console.log("Error editing a discount", error);
        }
    };

    useEffect(() => {
        let shamsi_start_at = moment
            .from(`${discount.start_at.substring(0, 10)}`, "en", "YYYY/MM/DD")
            .locale("fa")
            .format("YYYY/MM/DD");
        let shamsi_expired_at = moment
            .from(`${discount.expired_at.substring(0, 10)}`, "en", "YYYY/MM/DD")
            .locale("fa")
            .format("YYYY/MM/DD");
        console.log(shamsi_expired_at);
        setFormData({
            ...formData,
            start_at: {
                year: Number(shamsi_start_at?.substring(0, 4)),
                month: Number(shamsi_start_at?.substring(5, 7)),
                day: Number(shamsi_start_at?.substring(8, 10)),
            },
            expired_at: {
                year: Number(shamsi_expired_at?.substring(0, 4)),
                month: Number(shamsi_expired_at?.substring(5, 7)),
                day: Number(shamsi_expired_at?.substring(8, 10)),
            },
        });
    }, []);

    return (
        <form onSubmit={handleSubmit}>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />
            <BreadCrumbs
                substituteObj={{
                    copens: "کوپن تخفیف",
                    edit: "ویرایش",
                }}
            />

            <Box title="ویرایش کوپن تخفیف">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="name" className="form__label">
                            کد تخفیف :<span className="form__star">*</span>
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
                                value={formData.name}
                                disabled
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
                                value={formData.number}
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
                                        inputPlaceholder="انتخاب کنید"
                                        calendarPopperPosition="bottom"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="type" className="form__label">
                            نوع : <span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="type"
                                id="type"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.type}
                                disabled
                            >
                                <option value={0}>همه</option>
                                <option value={1}>جلسه آزمایشی</option>
                                <option value={2}>کلاس خصوصی</option>
                                <option value={3}>۵ جلسه</option>
                                <option value={4}>۱۰ جلسه</option>
                                <option value={5}>۱۶ جلسه</option>
                                <option value={6}>اولین خرید</option>
                                <option value={30}>کلاس گروهی</option>
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
                                            disabled
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
                                            disabled
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
                    {Number(formData.discount_type) === 1 && (
                        <>
                            <div className={`row ${styles["row"]}`}>
                                <div className={`col-sm-6 ${styles["col"]}`}>
                                    <div className="input-wrapper">
                                        <label
                                            htmlFor="value"
                                            className={`form__label ${
                                                Number(
                                                    formData.discount_type
                                                ) === 0
                                                    ? "form__label--disabled"
                                                    : undefined
                                            }`}
                                        >
                                            مبلغ تخفیف :
                                        </label>
                                        <div className="form-control">
                                            <input
                                                type="text"
                                                name="value"
                                                id="value"
                                                className={`form__input form__input--ltr`}
                                                onChange={handleOnChange}
                                                value={getFormattedPrice(
                                                    formData.value
                                                )}
                                                spellCheck={false}
                                                disabled={
                                                    Number(
                                                        formData.discount_type
                                                    ) === 0
                                                }
                                            />
                                            <span
                                                className={
                                                    Number(
                                                        formData.discount_type
                                                    ) === 0
                                                        ? "form__label--disabled"
                                                        : undefined
                                                }
                                            >
                                                تومان
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`col-sm-6`}>
                                    <div className="input-wrapper">
                                        <label
                                            htmlFor="min"
                                            className={`form__label ${
                                                Number(
                                                    formData.discount_type
                                                ) === 0
                                                    ? "form__label--disabled"
                                                    : undefined
                                            }`}
                                        >
                                            حداقل قیمت :
                                        </label>
                                        <div className="form-control">
                                            <input
                                                type="text"
                                                name="min"
                                                id="min"
                                                className={`form__input form__input--ltr`}
                                                onChange={handleOnChange}
                                                value={getFormattedPrice(
                                                    formData.min
                                                )}
                                                spellCheck={false}
                                                disabled={
                                                    Number(
                                                        formData.discount_type
                                                    ) === 0
                                                }
                                            />
                                            <span
                                                className={
                                                    Number(
                                                        formData.discount_type
                                                    ) === 0
                                                        ? "form__label--disabled"
                                                        : undefined
                                                }
                                            >
                                                تومان
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p style={{ color: "#444" }}>
                                <b>حداقل قیمت</b>، قیمت کف می باشد، یعنی اگر
                                خرید کاربر از این عدد بیشتر باشد، مبلغ تخفیف
                                کاملا برای کاربر اعمال می شود
                            </p>
                        </>
                    )}

                    {Number(formData.discount_type) === 0 && (
                        <>
                            <div className={`row ${styles["row"]}`}>
                                <div className={`col-sm-6 ${styles["col"]}`}>
                                    <div className="input-wrapper">
                                        <label
                                            htmlFor="percent"
                                            className={`form__label ${
                                                Number(
                                                    formData.discount_type
                                                ) === 1
                                                    ? "form__label--disabled"
                                                    : undefined
                                            }`}
                                        >
                                            درصد تخفیف :
                                        </label>
                                        <div className="form-control">
                                            <select
                                                name="percent"
                                                id="percent"
                                                className={`form__input input-select‍`}
                                                onChange={handleOnChange}
                                                value={formData.percent || ""}
                                                disabled={
                                                    Number(
                                                        formData.discount_type
                                                    ) === 1
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
                                <div className={`col-sm-6`}>
                                    <div className="input-wrapper">
                                        <label
                                            htmlFor="max"
                                            className={`form__label ${
                                                Number(
                                                    formData.discount_type
                                                ) === 1
                                                    ? "form__label--disabled"
                                                    : undefined
                                            }`}
                                        >
                                            سقف قیمت کل خرید :
                                        </label>
                                        <div className="form-control">
                                            <input
                                                type="text"
                                                name="max"
                                                id="max"
                                                className={`form__input form__input--ltr`}
                                                onChange={handleOnChange}
                                                value={getFormattedPrice(
                                                    formData.max
                                                )}
                                                spellCheck={false}
                                                autoComplete="off"
                                                disabled={
                                                    Number(
                                                        formData.discount_type
                                                    ) === 1
                                                }
                                            />
                                            <span
                                                className={
                                                    Number(
                                                        formData.discount_type
                                                    ) === 1
                                                        ? "form__label--disabled"
                                                        : undefined
                                                }
                                            >
                                                تومان
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p style={{ color: "#444" }}>
                                <b>سقف قیمت کل خرید</b>،حداکثر قیمت می باشد،
                                یعنی فالن درصد تخفیف(با توجه به درصد تخفیف)
                                اعمال می شودتا حداکثر قیمت کل خریدی که مشخص شده
                            </p>
                        </>
                    )}

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ویرایش کوپن تخفیف"}
                    </button>
                </div>
            </Box>
        </form>
    );
}

export default EditDiscount;
