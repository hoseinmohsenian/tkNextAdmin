import { useState } from "react";
import Alert from "../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../constants";
import Box from "../Elements/Box/Box";

function CreateSpecialty({ token, languages }) {
    const [formData, setFormData] = useState({
        language_id: 0,
        persian_name: "",
        english_name: "",
        url: "",
    });
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            Number(formData.language_id) !== 0 &&
            formData.persian_name.trim()
        ) {
            await addSpecialty();
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

    const addSpecialty = async () => {
        setLoading(true);
        try {
            let body = {
                persian_name: formData.persian_name,
                language_id: formData.language_id,
            };
            if (formData.english_name) {
                body = { ...body, english_name: formData.english_name };
            }
            if (formData.url) {
                body = { ...body, url: formData.url };
            }
            const res = await fetch(`${BASE_URL}/admin/teaching/speciality`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "success", "تخصص جدید با موفقیت اضافه شد");
                router.push("/content/specialty");
            } else {
                showAlert(true, "warning", "مشکلی پیش آمده");
            }
            setLoading(false);
        } catch (error) {
            console.log("Error adding a new specialty", error);
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

            <Box title="ایجاد تخصص">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="language_id" className="form__label">
                            زبان :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="language_id"
                                id="language_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.language_id}
                                required
                            >
                                <option value={0}>انتخاب کنید</option>
                                {languages?.map((lan) => (
                                    <option key={lan?.id} value={lan?.id}>
                                        {lan?.persian_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="persian_name" className="form__label">
                            نام فارسی :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="persian_name"
                                id="persian_name"
                                className="form__input"
                                onChange={handleOnChange}
                                autoComplete="off"
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="english_name" className="form__label">
                            نام انگلیسی :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="english_name"
                                id="english_name"
                                className="form__input"
                                onChange={handleOnChange}
                                autoComplete="off"
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="url" className="form__label">
                            url :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="url"
                                id="url"
                                className="form__input"
                                style={{ direction: "ltr", textAlign: "right" }}
                                onChange={handleOnChange}
                                autoComplete="off"
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ایجاد تخصص"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreateSpecialty;
