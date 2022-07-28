import { useState } from "react";
import Alert from "../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../../../Elements/Box/Box";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../../../Editor/Editor"), {
    ssr: false,
});
import API from "../../../../../../../api";

function CreatePagesList({ token, page_id }) {
    const [formData, setFormData] = useState({
        title: "",
        image: null,
        sum_desc: "",
        title_seo: "",
        seo_desc: "",
    });
    const [desc, setDesc] = useState("");
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
            fd.append("title", formData.title);
            if (desc) {
                fd.append("desc", desc);
            }
            if (formData.sum_desc) {
                fd.append("sum_desc", formData.sum_desc);
            }
            if (formData.title_seo) {
                fd.append("title_seo", formData.title_seo);
            }
            if (formData.seo_desc) {
                fd.append("seo_desc", formData.seo_desc);
            }
            if (formData.image) {
                fd.append("image", formData.image);
            }
            await addPageContent(fd);
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

    const addPageContent = async (fd) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/site-page/list/${page_id}`,
                fd
            );

            if (status === 200) {
                showAlert(true, "success", "محتوای جدید با موفقیت اضافه شد");
                router.push(`/tkpanel/pages/${page_id}/content`);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding a new page list", error);
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

            <Box title="ایجاد محتوای صفحه">
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
                        {loading ? "در حال انجام ..." : "ایجاد محتوا"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreatePagesList;
