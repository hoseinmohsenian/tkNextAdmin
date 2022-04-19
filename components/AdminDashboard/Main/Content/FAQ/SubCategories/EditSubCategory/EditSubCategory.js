import { useState } from "react";
import Alert from "../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../../constants";
import Box from "../../../Elements/Box/Box";

function EditSubCategory({ token, category, categories }) {
    const [formData, setFormData] = useState(category);
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
            formData.title.trim() &&
            formData.url.trim() &&
            Number(formData.parent_id) !== 0
        ) {
            const fd = new FormData();
            if (formData.title !== category.title) {
                fd.append("title", formData.title);
            }
            if (Number(formData.parent_id) !== category.parent_id) {
                fd.append("parent_id", Number(formData.parent_id));
            }
            if (formData.url !== category.url) {
                fd.append("url", formData.url);
            }
            if (
                formData.meta_desc &&
                formData.meta_desc !== category.meta_desc
            ) {
                fd.append("meta_desc", formData.meta_desc);
            }
            if (formData.meta_key && formData.meta_key !== category.meta_key) {
                fd.append("meta_key", formData.meta_key);
            }
            if (
                formData.meta_title &&
                formData.meta_title !== category.meta_title
            ) {
                fd.append("meta_title", formData.meta_title);
            }
            if (formData.image && typeof category.image !== "string") {
                fd.append("image", formData.image);
            }

            await addCategory(fd);
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

    const addCategory = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/faq/category/${category.id}`,
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
                showAlert(true, "success", "دسته بندی باموفقیت ویرایش شد");
                router.push("/tkpanel/FaqSubCategory");
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
            console.log("Error editing category", error);
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

            <Box title="ویرایش دسته بندی">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="title" className="form__label">
                            دسته بندی :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="parent_id"
                                id="parent_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.parent_id}
                                required
                            >
                                <option value={0}>انتخاب کنید</option>
                                {categories?.map((catg) => (
                                    <option key={catg?.id} value={catg?.id}>
                                        {catg?.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
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
                                value={formData.title}
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
                                required
                                value={formData.url}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="image" className="form__label">
                            تصویر :
                        </label>
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
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="meta_title"
                            className="form__label"
                            style={{ fontSize: 14 }}
                        >
                            Meta title :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="meta_title"
                                id="meta_title"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                                value={formData.meta_title || ""}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="meta_desc"
                            className="form__label"
                            style={{ fontSize: 14 }}
                        >
                            Meta description :
                        </label>
                        <textarea
                            type="text"
                            name="meta_desc"
                            id="meta_desc"
                            className="form__textarea"
                            onChange={handleOnChange}
                            spellCheck={false}
                            value={formData.meta_desc || ""}
                        />
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="meta_key"
                            className="form__label"
                            style={{ fontSize: 14 }}
                        >
                            Meta keyword:
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="meta_key"
                                id="meta_key"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                                value={formData.meta_key || ""}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ایجاد دسته بندی"}
                    </button>
                </div>
            </Box>
        </form>
    );
}

export default EditSubCategory;
