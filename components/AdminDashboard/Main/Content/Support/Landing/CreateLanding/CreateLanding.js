import { useState } from "react";
import Alert from "../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../../../Elements/Box/Box";
import API from "../../../../../../../api/index";

function CreateLanding() {
    const [formData, setFormData] = useState({
        title: "",
        url: "",
        banner_mobile_one: null,
        banner_desktop_one: null,
        banner_mobile_two: null,
        banner_desktop_two: null,
        banner_mobile_three: null,
        banner_desktop_three: null,
        banner_mobile_four: null,
        banner_desktop_four: null,
        banner_mobile_five: null,
        banner_desktop_five: null,
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

        if (formData.url.trim() && formData.title.trim()) {
            const fd = new FormData();
            fd.append("title", formData.title);
            fd.append("url", formData.url);

            if (formData.banner_mobile_one) {
                fd.append("banner_mobile_one", formData.banner_mobile_one);
            }
            if (formData.banner_desktop_one) {
                fd.append("banner_desktop_one", formData.banner_desktop_one);
            }
            if (formData.banner_mobile_two) {
                fd.append("banner_mobile_two", formData.banner_mobile_two);
            }
            if (formData.banner_desktop_two) {
                fd.append("banner_desktop_two", formData.banner_desktop_two);
            }
            if (formData.banner_mobile_three) {
                fd.append("banner_mobile_three", formData.banner_mobile_three);
            }
            if (formData.banner_desktop_three) {
                fd.append(
                    "banner_desktop_three",
                    formData.banner_desktop_three
                );
            }
            if (formData.banner_mobile_four) {
                fd.append("banner_mobile_four", formData.banner_mobile_four);
            }
            if (formData.banner_desktop_four) {
                fd.append("banner_desktop_four", formData.banner_desktop_four);
            }
            if (formData.banner_mobile_five) {
                fd.append("banner_mobile_five", formData.banner_mobile_five);
            }
            if (formData.banner_desktop_five) {
                fd.append("banner_desktop_five", formData.banner_desktop_five);
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
            const { response, status } = await API.post(
                `/admin/support/landing`,
                fd
            );

            if (status === 200) {
                let message = "لندینگ جدید باموفقیت اضافه شد";
                showAlert(true, "success", message);
                router.push("/tkpanel/landing/interactive/list");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding a new landing", error);
        }
        setLoading(false);
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
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="url" className="form__label">
                            url :<span className="form__star">*</span>
                        </label>
                        <div className="form-control form-control-url">
                            <input
                                type="text"
                                name="url"
                                id="url"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                required
                            />
                            <div className="form-control-label">
                                https://tikkaa.ir/landing/c/
                            </div>
                        </div>
                    </div>

                    <div className={`row`}>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="banner_mobile_one"
                                    className="form__label"
                                >
                                    بنر موبایل اول :
                                </label>
                                <div className="upload-box">
                                    <div
                                        className="upload-btn"
                                        onChange={(e) =>
                                            handleSelectFile(
                                                e,
                                                "banner_mobile_one"
                                            )
                                        }
                                    >
                                        <span>آپلود تصویر</span>
                                        <input
                                            type="file"
                                            className="upload-input"
                                            accept="image/png, image/jpg, image/jpeg"
                                        ></input>
                                    </div>
                                    <span className="upload-file-name">
                                        {formData?.banner_mobile_one?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="banner_desktop_one"
                                    className="form__label"
                                >
                                    بنر دسکتاپ اول :
                                </label>
                                <div className="upload-box">
                                    <div
                                        className="upload-btn"
                                        onChange={(e) =>
                                            handleSelectFile(
                                                e,
                                                "banner_desktop_one"
                                            )
                                        }
                                    >
                                        <span>آپلود تصویر</span>
                                        <input
                                            type="file"
                                            className="upload-input"
                                            accept="image/png, image/jpg, image/jpeg"
                                        ></input>
                                    </div>
                                    <span className="upload-file-name">
                                        {formData?.banner_desktop_one?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="banner_mobile_two"
                                    className="form__label"
                                >
                                    بنر موبایل دوم :
                                </label>
                                <div className="upload-box">
                                    <div
                                        className="upload-btn"
                                        onChange={(e) =>
                                            handleSelectFile(
                                                e,
                                                "banner_mobile_two"
                                            )
                                        }
                                    >
                                        <span>آپلود تصویر</span>
                                        <input
                                            type="file"
                                            className="upload-input"
                                            accept="image/png, image/jpg, image/jpeg"
                                        ></input>
                                    </div>
                                    <span className="upload-file-name">
                                        {formData?.banner_mobile_two?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="banner_desktop_two"
                                    className="form__label"
                                >
                                    بنر دسکتاپ دوم :
                                </label>
                                <div className="upload-box">
                                    <div
                                        className="upload-btn"
                                        onChange={(e) =>
                                            handleSelectFile(
                                                e,
                                                "banner_desktop_two"
                                            )
                                        }
                                    >
                                        <span>آپلود تصویر</span>
                                        <input
                                            type="file"
                                            className="upload-input"
                                            accept="image/png, image/jpg, image/jpeg"
                                        ></input>
                                    </div>
                                    <span className="upload-file-name">
                                        {formData?.banner_desktop_two?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="banner_mobile_three"
                                    className="form__label"
                                >
                                    بنر موبایل سوم :
                                </label>
                                <div className="upload-box">
                                    <div
                                        className="upload-btn"
                                        onChange={(e) =>
                                            handleSelectFile(
                                                e,
                                                "banner_mobile_three"
                                            )
                                        }
                                    >
                                        <span>آپلود تصویر</span>
                                        <input
                                            type="file"
                                            className="upload-input"
                                            accept="image/png, image/jpg, image/jpeg"
                                        ></input>
                                    </div>
                                    <span className="upload-file-name">
                                        {formData?.banner_mobile_three?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="banner_desktop_three"
                                    className="form__label"
                                >
                                    بنر دسکتاپ سوم :
                                </label>
                                <div className="upload-box">
                                    <div
                                        className="upload-btn"
                                        onChange={(e) =>
                                            handleSelectFile(
                                                e,
                                                "banner_desktop_three"
                                            )
                                        }
                                    >
                                        <span>آپلود تصویر</span>
                                        <input
                                            type="file"
                                            className="upload-input"
                                            accept="image/png, image/jpg, image/jpeg"
                                        ></input>
                                    </div>
                                    <span className="upload-file-name">
                                        {formData?.banner_desktop_three?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="banner_mobile_four"
                                    className="form__label"
                                >
                                    بنر موبایل چهارم :
                                </label>
                                <div className="upload-box">
                                    <div
                                        className="upload-btn"
                                        onChange={(e) =>
                                            handleSelectFile(
                                                e,
                                                "banner_mobile_four"
                                            )
                                        }
                                    >
                                        <span>آپلود تصویر</span>
                                        <input
                                            type="file"
                                            className="upload-input"
                                            accept="image/png, image/jpg, image/jpeg"
                                        ></input>
                                    </div>
                                    <span className="upload-file-name">
                                        {formData?.banner_mobile_four?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="banner_desktop_four"
                                    className="form__label"
                                >
                                    بنر دسکتاپ چهارم :
                                </label>
                                <div className="upload-box">
                                    <div
                                        className="upload-btn"
                                        onChange={(e) =>
                                            handleSelectFile(
                                                e,
                                                "banner_desktop_four"
                                            )
                                        }
                                    >
                                        <span>آپلود تصویر</span>
                                        <input
                                            type="file"
                                            className="upload-input"
                                            accept="image/png, image/jpg, image/jpeg"
                                        ></input>
                                    </div>
                                    <span className="upload-file-name">
                                        {formData?.banner_desktop_four?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="banner_mobile_five"
                                    className="form__label"
                                >
                                    بنر موبایل پنجم :
                                </label>
                                <div className="upload-box">
                                    <div
                                        className="upload-btn"
                                        onChange={(e) =>
                                            handleSelectFile(
                                                e,
                                                "banner_mobile_five"
                                            )
                                        }
                                    >
                                        <span>آپلود تصویر</span>
                                        <input
                                            type="file"
                                            className="upload-input"
                                            accept="image/png, image/jpg, image/jpeg"
                                        ></input>
                                    </div>
                                    <span className="upload-file-name">
                                        {formData?.banner_mobile_five?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-xs-6`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="banner_desktop_five"
                                    className="form__label"
                                >
                                    بنر دسکتاپ پنجم :
                                </label>
                                <div className="upload-box">
                                    <div
                                        className="upload-btn"
                                        onChange={(e) =>
                                            handleSelectFile(
                                                e,
                                                "banner_desktop_five"
                                            )
                                        }
                                    >
                                        <span>آپلود تصویر</span>
                                        <input
                                            type="file"
                                            className="upload-input"
                                            accept="image/png, image/jpg, image/jpeg"
                                        ></input>
                                    </div>
                                    <span className="upload-file-name">
                                        {formData?.banner_desktop_five?.name}
                                    </span>
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
