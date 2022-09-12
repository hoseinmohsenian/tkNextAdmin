import { useState } from "react";
import Alert from "../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../constants";
import Box from "../Elements/Box/Box";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

function EditLanguage({ token, language }) {
    const [formData, setFormData] = useState(language);
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
            formData.persian_name.trim() &&
            formData.english_name.trim() &&
            formData.url.trim() &&
            formData.flag_image
        ) {
            const fd = new FormData();
            if (formData.persian_name !== language?.persian_name) {
                fd.append("persian_name", formData.persian_name);
            }
            if (formData.english_name !== language?.english_name) {
                fd.append("english_name", formData.english_name);
            }
            if (formData.url !== language?.url) {
                fd.append("url", formData.url);
            }
            if (typeof formData.flag_image !== "string") {
                fd.append("flag_image", formData.flag_image);
            }

            await editLanguage(fd);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectFile = (e) => {
        let file = e.target.files[0];
        setFormData({ ...formData, flag_image: file });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const editLanguage = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/language/${formData?.id}`,
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
                showAlert(
                    true,
                    "success",
                    `زبان ${formData?.persian_name} با موفقیت ویرایش شد`
                );
                router.push("/content/language");
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
            console.log("Error editing language", error);
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
                    content: "محتوا",
                    language: "زبان ها",
                    edit: "ویرایش",
                }}
            />

            <Box title="ویرایش زبان">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="persian_name" className="form__label">
                            نام فارسی :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="persian_name"
                                id="persian_name"
                                className="form__input"
                                onChange={handleOnChange}
                                value={formData?.persian_name}
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
                                value={formData?.english_name}
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
                                value={formData?.url}
                                autoComplete="off"
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="flag_image" className="form__label">
                            پرچم :
                        </label>
                        <div className="upload-btn" onChange={handleSelectFile}>
                            <span>آپلود تصویر</span>
                            <input
                                type="file"
                                className="upload-input"
                                accept="image/png, image/jpg, image/jpeg"
                            ></input>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ویرایش زبان"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default EditLanguage;
