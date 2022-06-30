import { useState } from "react";
import Alert from "../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../../constants";
import Box from "../../../Elements/Box/Box";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../../../Editor/Editor"), {
    ssr: false,
});

function EditPagesList({ content, token, content_id, page_id }) {
    const [formData, setFormData] = useState(content);
    const [desc, setDesc] = useState(formData.desc || "");
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.title.trim()) {
            const fd = new FormData();
            if (formData.title && formData.title !== content.title) {
                fd.append("title", formData.title);
            }
            if (desc !== content.desc) {
                fd.append("desc", desc);
            }
            if (formData.sum_desc && formData.sum_desc !== content.sum_desc) {
                fd.append("sum_desc", formData.sum_desc);
            }
            if (
                formData.title_seo &&
                formData.title_seo !== content.title_seo
            ) {
                fd.append("title_seo", formData.title_seo);
            }
            if (formData.seo_desc && formData.seo_desc !== content.seo_desc) {
                fd.append("seo_desc", formData.seo_desc);
            }
            if (formData.image && typeof formData.image !== "string") {
                fd.append("image", formData.image);
            }
            await editPageContent(fd);
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

    const editPageContent = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/site-page/edit/list/${content_id}`,
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
                showAlert(true, "success", "محتوای صفحه با موفقیت ویرایش شد");
                router.push(`/tkpanel/pages/${page_id}/content`);
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
            console.log("Error editing page list", error);
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

            <Box title="ویرایش محتوای صفحه">
                <form onSubmit={handleSubmit} className="form">
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
                                value={formData.title}
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="summary_desc" className="form__label">
                            توضیحات :
                        </label>
                        <div>
                            <Editor
                                value={desc}
                                setValue={setDesc}
                                token={token}
                                uploadImageUrl="/admin/blog/article/add/image"
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="sum_desc" className="form__label">
                            توضیحات کوتاه :
                        </label>
                        <textarea
                            type="text"
                            name="sum_desc"
                            id="sum_desc"
                            className="form__textarea"
                            onChange={handleOnChange}
                            value={formData.sum_desc || ""}
                            spellCheck={false}
                        />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="title_seo" className="form__label">
                            عنوان سئو :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="title_seo"
                                id="title_seo"
                                className="form__input"
                                onChange={handleOnChange}
                                value={formData.title_seo || ""}
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
                            value={formData.seo_desc || ""}
                            spellCheck={false}
                        />
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
                        {loading ? "در حال انجام ..." : "ویرایش محتوا"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default EditPagesList;
