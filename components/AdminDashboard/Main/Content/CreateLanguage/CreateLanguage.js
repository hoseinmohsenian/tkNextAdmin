import { useState } from "react";
import Alert from "../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../Elements/Box/Box";
import API from "../../../../../api/index";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

function CreateLanguage() {
    const [formData, setFormData] = useState({
        persian_name: "",
        english_name: "",
        url: "",
        flag_image: null,
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
            formData.persian_name.trim() &&
            formData.english_name.trim() &&
            formData.url.trim() &&
            formData.flag_image
        ) {
            const fd = new FormData();
            fd.append("persian_name", formData.persian_name);
            fd.append("english_name", formData.english_name);
            fd.append("url", formData.url);
            fd.append("flag_image", formData.flag_image);
            await addLanguage(fd);
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

    const addLanguage = async (fd) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(`/admin/language`, fd);

            if (status === 200) {
                showAlert(true, "success", "زبان جدید با موفقیت اضافه شد");
                router.push("/content/language");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding a new language", error);
        }
        setLoading(false);
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
                    create: "ایجاد",
                }}
            />

            <Box title="ایجاد زبان">
                <form onSubmit={handleSubmit} className="form">
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
                            نام انگلیسی :<span className="form__star">*</span>
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
                            url :<span className="form__star">*</span>
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
                    <div className="input-wrapper">
                        <label htmlFor="flag_image" className="form__label">
                            پرچم :<span className="form__star">*</span>
                        </label>
                        <div className="upload-box">
                            <div
                                className="upload-btn"
                                onChange={(e) => handleSelectFile(e)}
                            >
                                <span>آپلود تصویر</span>
                                <input
                                    type="file"
                                    className="upload-input"
                                    accept="image/png, image/jpg, image/jpeg"
                                    required
                                ></input>
                            </div>
                            <span className="upload-file-name">
                                {formData?.flag_image?.name}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ایجاد زبان"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreateLanguage;
