import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../../Elements/Box/Box";
import API from "../../../../../../api";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../../Editor/Editor"), {
    ssr: false,
});

function CreateHelp({ token }) {
    const [formData, setFormData] = useState({
        title: "",
        url: 1,
        redirect_status: 0,
        redirect_url: "",
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

        if (formData.title.trim() && desc && formData.url.trim()) {
            let body = {
                title: formData.title,
                desc: desc,
                url: formData.url,
                redirect_status: Number(formData.redirect_status),
            };
            if (
                formData.redirect_url.trim() &&
                Number(formData.redirect_status) === 1
            ) {
                body = { ...body, redirect_url: formData.redirect_url };
            }
            await addHelp(body);
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

    const addHelp = async (body) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/help/create`,
                body
            );

            if (status === 200) {
                showAlert(true, "success", "راهنمای جدید با موفقیت اضافه شد");
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
            console.log("Error adding a new help", error);
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

            <Box title="ایجاد راهنما">
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
                            توضیحات :<span className="form__star">*</span>
                        </label>
                        <div>
                            <Editor
                                value={desc}
                                setValue={setDesc}
                                token={token}
                                uploadImageUrl="/admin/help/image"
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
                        {loading ? "در حال انجام ..." : "ایجاد راهنما"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreateHelp;
