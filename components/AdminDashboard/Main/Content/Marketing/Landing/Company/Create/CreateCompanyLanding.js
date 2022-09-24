import { useEffect, useState } from "react";
import Alert from "../../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import Box from "../../../../Elements/Box/Box";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../../../../Editor/Editor"), {
    ssr: false,
});
import BreadCrumbs from "../../../../Elements/Breadcrumbs/Breadcrumbs";
import API from "../../../../../../../../api";

function CreateCompanyLanding({ token }) {
    const [formData, setFormData] = useState({
        title: "",
        url: "",
        image: null,
        video_title: "",
        video: "",
        faq_title: "",
        seo_title: "",
        seo_desc: "",
        seo_key: "",
    });
    const [headerDesc, setHeaderDesc] = useState("");
    const [header, setHeader] = useState("");
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    moment.locale("fa", { useGregorianParser: true });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.title.trim() && formData.url.trim()) {
            const fd = new FormData();
            if (headerDesc) {
                fd.append("header_desc", headerDesc);
            }
            if (header) {
                fd.append("header", header);
            }
            Object.keys(formData).map((key) => {
                if (formData[key]) {
                    fd.append(key, formData[key]);
                }
            });

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
                `/admin/organization`,
                fd
            );

            if (status === 200) {
                showAlert(true, "success", `لندینگ جدید باموفقیت اضافه شد`);
                router.push("/tkpanel/landing/company");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding a new company landing", error);
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

            <BreadCrumbs
                substituteObj={{
                    landing: "لندینگ",
                    company: "لندینگ شرکتی",
                    create: "ایجاد",
                }}
            />

            <Box title="ایجاد لندینگ شرکتی">
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
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="url" className="form__label">
                            URL :<span className="form__star">*</span>
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
                                https://tikkaa.ir/organization
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="image" className="form__label">
                            icon :
                        </label>
                        <div className="upload-box">
                            <div
                                className="upload-btn"
                                onChange={(e) => handleSelectFile(e, "image")}
                            >
                                <span>آپلود تصویر</span>
                                <input
                                    type="file"
                                    className="upload-input"
                                    accept="image/png, image/jpg, image/jpeg"
                                ></input>
                            </div>
                            <span className="upload-file-name">
                                {formData?.image?.name}
                            </span>
                        </div>
                    </div>
                </div>
            </Box>
            <Box title="ویدئو">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="video_title" className="form__label">
                            عنوان ویدئو :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="video_title"
                                id="video_title"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="video" className="form__label">
                            لینک ویدئو :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="video"
                                id="video"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                </div>
            </Box>
            <Box title="FAQ">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="faq_title" className="form__label">
                            عنوان FAQ :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="faq_title"
                                id="faq_title"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                </div>
            </Box>
            <Box title="توضیحات">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="summary_desc" className="form__label">
                            توضیحات هدر :
                        </label>
                        <div>
                            <Editor
                                value={headerDesc}
                                setValue={setHeaderDesc}
                                token={token}
                                uploadImageUrl="/admin/blog/article/add/image"
                            />
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="summary_desc" className="form__label">
                            توضیحات کلی :
                        </label>
                        <div>
                            <Editor
                                value={header}
                                setValue={setHeader}
                                token={token}
                                uploadImageUrl="/admin/blog/article/add/image"
                            />
                        </div>
                    </div>
                </div>
            </Box>
            <Box title="سئو">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="seo_title" className="form__label">
                            عنوان سئو :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="seo_title"
                                id="seo_title"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="seo_desc" className="form__label">
                            توضیحات سئو :
                        </label>
                        <textarea
                            type="text"
                            name="seo_desc"
                            id="seo_desc"
                            className="form__textarea"
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="seo_key" className="form__label">
                            کلمات سئو :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="seo_key"
                                id="seo_key"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                            />
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

export default CreateCompanyLanding;
