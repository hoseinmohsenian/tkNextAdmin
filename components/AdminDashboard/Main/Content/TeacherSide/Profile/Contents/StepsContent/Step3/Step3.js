import { useEffect, useState } from "react";
import styles from "./Step3.module.css";
import Error from "../../../../../../../../Error/Error";
import Alert from "../../../../../../../../Alert/Alert";

function Step3({ token, alertData, showAlert }) {
    const [formData, setFormData] = useState({
        title: "",
        desc: "",
        experience: "",
    });
    const [errors, setErrors] = useState([]);
    const [pageLoaded, setPageLoaded] = useState(false);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
            const res = await fetch(`${BASE_URL}/teacher/profile/add/title`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    // "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(
                    true,
                    "success",
                    "توضیحات پروفایل با موفقیت ویرایش شد"
                );
                setErrors([]);
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding profile image ", error);
        }
    };

    const handleClick = (e) => {
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
                    temp = [titleMessage, ...temp];
                }
            } else {
                temp = temp?.filter((item) => item !== titleMessage);
            }
            if (formData.desc.length < 70) {
                if (formData.desc.trim() === "") {
                    // desc required
                    if (findError(errors, descMessage) === undefined) {
                        temp = [descMessage, ...temp];
                    }
                    // min characters for desc
                    if (findError(errors, descCharMessage) === undefined) {
                        temp = [descCharMessage, ...temp];
                    }
                } else {
                    if (findError(errors, descCharMessage) === undefined) {
                        temp = [descCharMessage, ...temp];
                    } else {
                        temp = temp?.filter((item) => item != descMessage);
                    }
                }
            } else {
                temp = temp?.filter((item) => item !== descCharMessage);
            }

            setErrors(() => temp);
            showAlert(true, "danger", "لطفا فیلدهای ضروری را تکمیل کنید");
        }
    };

    const getTitle = async () => {
        setPageLoaded(false);
        try {
            const res = await fetch(
                `${BASE_URL}/teacher/profile/return/title`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setFormData(data);
        } catch (error) {
            console.log("Error reading public info ", error);
        }
        setPageLoaded(true);
    };

    return (
        <div className={styles.step}>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleClick}
            />

            {pageLoaded ? (
                <>
                    <div className={styles.step__box}>
                        <form>
                            <div className={styles["step__row"]}>
                                <div className={styles["step__row-wrapper"]}>
                                    <div
                                        className={`${styles["step__input-container"]}`}
                                    >
                                        <div
                                            className={
                                                styles["step__input-wrapper"]
                                            }
                                        >
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
                                    <span
                                        className={
                                            styles["step__input-explanation"]
                                        }
                                    >
                                        به عنوان مثال مدرس آیلتس با ۹ سال سابقه
                                        تدریس
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div
                                    className={`${styles["step__row"]} ${styles["step__row--m0"]}`}
                                >
                                    <div
                                        className={styles["step__row-wrapper"]}
                                    >
                                        <div
                                            className={`${styles["step__input-container"]}`}
                                        >
                                            <div
                                                className={
                                                    styles[
                                                        "step__input-wrapper"
                                                    ]
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
                                            <span className={styles.star}>
                                                *
                                            </span>
                                        </div>
                                        <span
                                            className={
                                                styles[
                                                    "step__input-explanation"
                                                ]
                                            }
                                        >
                                            لطفا در توضیحات حتما منابع مورد
                                            استفاده در تدریس، سابقه تدریس خود و
                                            خلاصه ای از روش های تدریس زبانی که
                                            از آن ها استفاده میکنید را ذکر کنید.
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className={styles["step__input-char-count"]}
                                >
                                    تعداد کاراکتر: {formData.desc?.length || 0}
                                </div>
                            </div>

                            <div className={styles["step__row"]}>
                                <div className={styles["step__row-wrapper"]}>
                                    <div
                                        className={`${styles["step__input-container"]}`}
                                    >
                                        <span
                                            className={
                                                styles["step__row-title"]
                                            }
                                        >
                                            تجربه تدریس
                                        </span>
                                        <div
                                            className={
                                                styles["step__input-wrapper"]
                                            }
                                        >
                                            <input
                                                type="number"
                                                placeholder="3"
                                                maxLength={2}
                                                name="experience"
                                                value={
                                                    formData.experience || ""
                                                }
                                                onChange={handleOnChange}
                                                className={styles.step__input}
                                            />
                                        </div>
                                        <span
                                            className={
                                                styles["step__input--year"]
                                            }
                                        >
                                            سال
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className={styles["step__row"]}>
                        {errors?.length !== 0 && <Error errorList={errors} />}
                    </div>

                    <div className={styles["step__btn-wrapper"]}>
                        <button
                            type="button"
                            className={`${styles["step__btn"]} ${styles["step__btn--next"]} primary`}
                            onClick={handleClick}
                        >
                            ذخیره
                        </button>
                    </div>
                </>
            ) : (
                <div>
                    <h2>در حال خواندن اطلاعات...</h2>
                </div>
            )}
        </div>
    );
}

export default Step3;
