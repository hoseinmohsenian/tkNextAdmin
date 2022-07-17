import { useEffect, useState } from "react";
import styles from "./Step3.module.css";
import Error from "../../../../../../../../Error/Error";

function Step3({ token }) {
    const [formData, setFormData] = useState({
        title: "",
        desc: "",
        experience: "",
    });
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (token) {
            getTitle();
        }
    }, [token]);

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const addTitle = async (formData, tokenS) => {
        try {
            const res = await fetch(
                "https://api.barmansms.ir/api/teacher/profile/add/title",
                {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        // "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            console.log("res", res);
        } catch (error) {
            console.log("Error adding profile image ", error);
        }
    };

    const handleClick = (e) => {
        console.log(e);
        e.preventDefault();

        if (
            formData.title.trim() !== "" &&
            formData.desc.trim() !== "" &&
            formData.desc.trim().length >= 70
        ) {
            let body = {
                title: formData.title.trim(),
                desc: formData.desc.trim(),
                experience: formData.experience,
            };
            addTitle(body, token);
        } else {
            // Error Handling
            let temp = errors;
            let titleMessage = "فیلد عنوان الزامی است.";
            let descMessage = "فیلد توضیحات الزامی است.";
            let descCharMessage =
                "توضیحات نباید کمتر از 70 کاراکتر داشته باشد.";

            const findError = (items, target) => {
                return items?.find((item) => item === target);
            };

            if (formData.title.trim() === "") {
                if (findError(errors, titleMessage) === undefined) {
                    setErrors((oldErrors) => [...oldErrors, titleMessage]);
                }
            } else {
                temp = temp?.filter((item) => item != titleMessage);
                setErrors(() => temp);
            }
            if (formData.desc.trim().length < 70) {
                if (formData.desc.trim() === "") {
                    if (findError(errors, descMessage) === undefined) {
                        // desc required
                        setErrors((oldErrors) => [...oldErrors, descMessage]);
                        // min character for desc
                        setErrors((oldErrors) => [
                            ...oldErrors,
                            descCharMessage,
                        ]);
                    }
                } else {
                    if (findError(errors, descCharMessage) === undefined) {
                        setErrors((oldErrors) => [
                            ...oldErrors,
                            descCharMessage,
                        ]);
                    } else {
                        temp = temp?.filter((item) => item != descMessage);
                        setErrors(() => temp);
                    }
                }
            } else {
                temp = temp?.filter((item) => item != descCharMessage);
                setErrors(() => temp);
            }
        }
    };

    const getTitle = async () => {
        // console.log(ee)
        try {
            const res = await fetch(
                "https://api.barmansms.ir/api/teacher/profile/return/title",
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            console.log("data");
            console.log(data);
            setFormData(data);
        } catch (error) {
            console.log("Error reading public info ", error);
        }
    };

    return (
        <div className={styles.step}>
            <div className={styles.step__box}>
                <div className={styles["step__row"]}>
                    {errors?.length !== 0 && <Error errorList={errors} />}
                </div>
                <form>
                    <div className={styles["step__row"]}>
                        <div className={styles["step__row-wrapper"]}>
                            <div
                                className={`${styles["step__input-container"]}`}
                            >
                                <div className={styles["step__input-wrapper"]}>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title || ""}
                                        onChange={handleOnChange}
                                        className={styles.step__input}
                                        placeholder="عنوان پروفایل"
                                    />
                                </div>
                                <span className={styles.star}>*</span>
                            </div>
                            <span className={styles["step__input-explanation"]}>
                                به عنوان مثال مدرس آیلتس با 9 سال سابقه تدریس
                            </span>
                        </div>
                    </div>
                    <div>
                        <div
                            className={`${styles["step__row"]} ${styles["step__row--m0"]}`}
                        >
                            <div className={styles["step__row-wrapper"]}>
                                <div
                                    className={`${styles["step__input-container"]}`}
                                >
                                    <div
                                        className={
                                            styles["step__input-wrapper"]
                                        }
                                    >
                                        <textarea
                                            name="desc"
                                            value={formData.desc || ""}
                                            onChange={handleOnChange}
                                            className={`${styles.step__input} ${styles.step__textarea}`}
                                            placeholder="توضیحات (حداقل 70 کاراکتر)"
                                        />
                                    </div>
                                    <span className={styles.star}>*</span>
                                </div>
                                <span
                                    className={
                                        styles["step__input-explanation"]
                                    }
                                >
                                    لطفا در توضیحات حتما منابع مورد استفاده در
                                    تدریس، سابقه تدریس خود و خلاصه ای از روش های
                                    تدریس زبانی که از آن ها استفاده میکنید را
                                    ذکر کنید.
                                </span>
                            </div>
                        </div>
                        <div className={styles["step__input-char-count"]}>
                            تعداد کاراکتر: {formData.desc?.length || 0}
                        </div>
                    </div>

                    <div className={styles["step__row"]}>
                        <div className={styles["step__row-wrapper"]}>
                            <div
                                className={`${styles["step__input-container"]}`}
                            >
                                <span className={styles["step__row-title"]}>
                                    تجربه تدریس
                                </span>
                                <div className={styles["step__input-wrapper"]}>
                                    <input
                                        type="number"
                                        placeholder="3"
                                        maxLength={2}
                                        name="experience"
                                        value={formData.experience || ""}
                                        onChange={handleOnChange}
                                        className={styles.step__input}
                                    />
                                </div>
                                <span className={styles["step__input--year"]}>
                                    سال
                                </span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className={styles["step__btn-wrapper"]}>
                <button
                    type="button"
                    className={`${styles["step__btn"]} ${styles["step__btn--next"]}`}
                    onClick={handleClick}
                >
                    ذخیره
                </button>
            </div>
        </div>
    );
}

export default Step3;
