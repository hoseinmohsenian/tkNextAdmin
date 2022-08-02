import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../../Elements/Box/Box";
import API from "../../../../../../api";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../../Editor/Editor"), {
    ssr: false,
});

function EditHelp({ token, data }) {
    const [formData, setFormData] = useState(data);
    const [desc, setDesc] = useState(data.desc || "");
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.title.trim() && desc && formData.url.trim()) {
            let body = {};
            if (formData.title !== data.title) {
                body = { ...body, title: formData.title };
            }
            if (desc !== data.desc) {
                body = { ...body, desc };
            }
            if (formData.url !== data.url) {
                body = { ...body, url: formData.url };
            }
            if (
                formData.redirect_url &&
                formData.redirect_url !== data.redirect_url &&
                Number(formData.redirect_status) === 1
            ) {
                body = { ...body, redirect_url: formData.redirect_url };
            }
            if (Number(formData.redirect_status) !== data.redirect_status) {
                body = {
                    ...body,
                    redirect_status: Number(formData.redirect_status),
                };
            }
            await editHelp(body);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const handleOnChange = (e) => {
        const name = e.target.name;
        const type = e.target.type;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const editHelp = async (body) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/help/edit/${data.id}`,
                body
            );

            if (status === 200) {
                showAlert(true, "success", "راهنما با موفقیت ویرایش شد");
                router.push("/tkpanel/help/admin");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error editing help", error);
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

            <Box title="ویرایش راهنما">
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
                            توضیحات :<span className="form__star">*</span>
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
                                value={formData.url}
                                required
                            />
                            <div className="form-control-label">
                                https://tikkaa.ir/help/
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="redirect_status"
                            className={`form__label`}
                        >
                            ریدایرکت : <span className="form__star">*</span>
                        </label>
                        <div className="form-control form-control-radio">
                            <div className="input-radio-wrapper">
                                <label
                                    htmlFor="redirect_status"
                                    className="radio-title"
                                >
                                    ریدایرکت
                                </label>
                                <input
                                    type="checkbox"
                                    name="redirect_status"
                                    onChange={handleOnChange}
                                    checked={
                                        Number(formData.redirect_status) === 1
                                    }
                                    id="redirect_status"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="redirect_url"
                            className={`form__label ${
                                Number(formData.redirect_status) === 0
                                    ? "form__label--disabled"
                                    : undefined
                            }`}
                        >
                            URL ریدایرکت :
                        </label>
                        <div className="form-control form-control-url">
                            <input
                                type="text"
                                name="redirect_url"
                                id="redirect_url"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                value={formData.redirect_url || ""}
                                disabled={
                                    Number(formData.redirect_status) === 0
                                }
                            />
                            <div className="form-control-label">
                                https://tikkaa.ir/help/
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ویرایش راهنما"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default EditHelp;
