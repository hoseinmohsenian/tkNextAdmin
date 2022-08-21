import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

function EditSitePage({ token, page }) {
    const [formData, setFormData] = useState(page);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.name.trim() && formData.url.trim()) {
            const fd = new FormData();
            if (formData.name !== page?.name) {
                fd.append("name", formData.name);
            }
            if (formData.url !== page?.url) {
                fd.append("url", formData.url);
            }
            if (typeof formData.image !== "string" && formData.image) {
                fd.append("image", formData.image);
            }

            await editPage(fd);
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
        setFormData({ ...formData, image: file });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const editPage = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/site-page/${formData?.id}`,
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
                showAlert(true, "success", `صفحه با موفقیت ویرایش شد`);
                router.push("/tkpanel/pages");
            } else {
                showAlert(true, "warning", "مشکلی پیش آمده");
            }
            setLoading(false);
        } catch (error) {
            console.log("Error editing site page", error);
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
                    pages: "صفحات سایت",
                    edit:"ویرایش"
                }}
            />

            <Box title="ویرایش صفحه سایت">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="name" className="form__label">
                            نام :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form__input"
                                onChange={handleOnChange}
                                value={formData.name || ""}
                                spellCheck={false}
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
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                value={formData.url || ""}
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="image" className="form__label">
                            تصویر :
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

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ویرایش صفحه"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default EditSitePage;
