import { useState } from "react";
import styles from "../Create/Create.module.css";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../../Elements/Box/Box";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

function EditSemiPrivate({ token, theClass }) {
    const [formData, setFormData] = useState({ ...theClass, rate: 0 });
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.title.trim() && Number(formData.price) !== 0) {
            const fd = new FormData();
            if (formData.title !== theClass.title) {
                fd.append("title", formData.title);
            }
            if (Number(formData.price) !== theClass.price) {
                fd.append("price", Number(formData.price));
            }
            await editClass(fd);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const editClass = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/semi-private/${formData.id}`,
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
                showAlert(true, "success", "کلاس باموفقیت ویرایش شد");
                router.push("/tkpanel/semi-private-admin");
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
            console.log("Error editing semi-private class", error);
        }
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <BreadCrumbs
                substituteObj={{
                    "semi-private-admin": "کلاس نیمه خصوصی",
                    edit: "ویرایش",
                }}
            />

            <Box title="ویرایش کلاس نیمه خصوصی">
                <form onSubmit={handleSubmit} className="form">
                    <div className={styles["inputs-container"]}>
                        <div className={styles["row-wrapper"]}>
                            <div className={styles["number"]}>1</div>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label
                                    htmlFor="persian_name"
                                    className="form__label"
                                >
                                    زبان :
                                </label>
                                <div className="form-control">
                                    <select
                                        name="language_id"
                                        id="language_id"
                                        className="form__input input-select"
                                        onChange={handleOnChange}
                                        value={formData.language_id}
                                        required
                                        disabled
                                    >
                                        <option value={formData.language_id}>
                                            {formData.language_name}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className={styles["row-wrapper"]}>
                            <div className={styles["number"]}>2</div>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label htmlFor="title" className="form__label">
                                    عنوان :<span className="form__star">*</span>
                                </label>
                                <div className="form-control">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        className="form__input"
                                        onChange={handleOnChange}
                                        value={formData.title}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles["row-wrapper"]}>
                            <div className={styles["number"]}>3</div>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label htmlFor="price" className="form__label">
                                    قیمت :
                                </label>
                                <div className="form-control">
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        className="form__input form__input--ltr"
                                        onChange={handleOnChange}
                                        value={formData.price}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ویرایش کلاس"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default EditSemiPrivate;
