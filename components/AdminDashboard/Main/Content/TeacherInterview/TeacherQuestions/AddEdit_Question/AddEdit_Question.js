import { memo, useState } from "react";
import Alert from "../../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../../constants";
import styles from "./AddEdit_Question.module.css";

function AddEdit_Question({
    showAlert,
    alertData,
    setIsModalOpen,
    token,
    readQuestions,
    formData,
    setFormData,
    data,
}) {
    const [loading, setLoading] = useState(false);
    const isEditing = Boolean(formData.id);

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (formData.answer && formData.question) {
            if (isEditing) {
                let body = {};
                if (formData.question !== data.question) {
                    body = { ...body, question: formData.question };
                }
                if (formData.answer !== data.answer) {
                    body = { ...body, answer: formData.answer };
                }
                await editQuestion(body);
            } else {
                await addQuestion();
            }
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const addQuestion = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/interview/create`,
                {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = "پرسش جدید باموفقیت ثبت شد";
                showAlert(true, "success", message);
                setIsModalOpen(false);
                await readQuestions();
            } else {
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error adding new question", error);
        }
        setLoading(false);
    };

    const editQuestion = async (body) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/interview/edit/${formData.id}`,
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = "پرسش باموفقیت ویرایش شد";
                showAlert(true, "success", message);
                setIsModalOpen(false);
                await readQuestions();
            } else {
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error editing question", error);
        }
        setLoading(false);
    };

    return (
        <>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <h3 className={styles["title"]}>
                {isEditing ? "ویرایش" : "تعریف"} پرسش
            </h3>

            <form className="form">
                <div className="input-wrapper">
                    <label
                        htmlFor="question"
                        className={`form__label ${styles.form__label}`}
                    >
                        سوال :<span className="form__star">*</span>
                    </label>
                    <div className="form-control">
                        <input
                            type="text"
                            name="question"
                            id="question"
                            className="form__input"
                            onChange={handleOnChange}
                            value={formData.question}
                            spellCheck={false}
                            required
                        />
                    </div>
                </div>
                <div className="input-wrapper">
                    <label
                        htmlFor="answer"
                        className={`form__label ${styles.form__label}`}
                    >
                        جواب :<span className="form__star">*</span>
                    </label>
                    <textarea
                        type="text"
                        name="answer"
                        id="answer"
                        className={`form__textarea ${styles.textarea}`}
                        onChange={handleOnChange}
                        value={formData.answer}
                        spellCheck={false}
                    />
                </div>
                <button
                    type="button"
                    className="btn primary"
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {loading
                        ? "در حال انجام ..."
                        : isEditing
                        ? "ویرایش"
                        : "اضافه کردن"}
                </button>
            </form>
        </>
    );
}

export default memo(AddEdit_Question);
