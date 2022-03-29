import { useState } from "react";
import Alert from "../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../../constants";
import Box from "../../../Elements/Box/Box";

function CreateLanding({ token }) {
    const [formData, setFormData] = useState({
        url: "",
        banner_desktop: null,
        banner_mobile: null,
        desc: "",
        video_link: "",
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

        if (formData.url.trim()) {
            const fd = new FormData();
            fd.append("url", formData.url);
            if (formData.desc) {
                fd.append("desc", formData.desc);
            }
            if (formData.video_link) {
                fd.append("video_link", formData.video_link);
            }
            if (formData.banner_desktop) {
                fd.append("banner_desktop", formData.banner_desktop);
            }
            if (formData.banner_mobile) {
                fd.append("banner_mobile", formData.banner_mobile);
            }

            await addLanding(fd);
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

    const handleSelectFile = (e, name) => {
        let file = e.target.files[0];
        setFormData({ ...formData, [name]: file });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const addLanding = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/support/landing`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                let message = "لندینگ جدید باموفقیت اضافه شد";
                showAlert(true, "success", message);
                router.push("/tkpanel/landing/users/list");
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
            console.log("Error adding a new landing", error);
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

            <Box title="ایجاد لندینگ">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="url" className="form__label">
                            url :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="url"
                                id="url"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="desc" className="form__label">
                            توضیحات :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="desc"
                                id="desc"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="video_link" className="form__label">
                            لینک ویدئو :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="video_link"
                                id="video_link"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    <div className={`row`}>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="banner_desktop"
                                    className="form__label"
                                >
                                    بنر دستکاپ :
                                </label>
                                <div
                                    className="upload-btn"
                                    onChange={(e) =>
                                        handleSelectFile(e, "banner_desktop")
                                    }
                                >
                                    <span>آپلود تصویر</span>
                                    <input
                                        type="file"
                                        className="upload-input"
                                        accept="image/png, image/jpg, image/jpeg"
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="banner_mobile"
                                    className="form__label"
                                >
                                    بنر موبایل :
                                </label>
                                <div
                                    className="upload-btn"
                                    onChange={(e) =>
                                        handleSelectFile(e, "banner_mobile")
                                    }
                                >
                                    <span>آپلود تصویر</span>
                                    <input
                                        type="file"
                                        className="upload-input"
                                        accept="image/png, image/jpg, image/jpeg"
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ایجاد لندینگ"}
                    </button>
                </div>
            </Box>
        </form>
    );
}

export default CreateLanding;
