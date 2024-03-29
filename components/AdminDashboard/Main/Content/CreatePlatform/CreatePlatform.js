import { useState } from "react";
import Alert from "../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../Elements/Box/Box";
import API from "../../../../../api/index";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

function CreatePlatform() {
    const [formData, setFormData] = useState({
        name: "",
        desc: "",
        image: null,
        status: 0,
        suggestion: 0,
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

        if (formData.name.trim()) {
            const fd = new FormData();
            fd.append("name", formData.name);
            if (formData.desc) {
                fd.append("desc", formData.desc);
            }
            if (formData.image) {
                fd.append("image", formData.image);
            }
            fd.append("status", formData.status ? 1 : 0);
            fd.append("suggestion", formData.suggestion);
            await addPlatform(fd);
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

    const addPlatform = async (fd) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(`/admin/platform`, fd);
            if (status === 200) {
                showAlert(true, "success", "پلتفرم جدید با موفقیت اضافه شد");
                router.push("/tkpanel/multiplatform");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding a new platform", error);
        }
        setLoading(false);
    };

    const handleSelectFile = (e) => {
        let file = e.target.files[0];
        setFormData({ ...formData, image: file });
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
                    multiplatform: "پلتفرم ها",
                    create: "ایجاد",
                }}
            />
            <Box title="ایجاد پلتفرم">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="name" className="form__label">
                            نام پلتفرم :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form__input"
                                onChange={handleOnChange}
                                autoComplete="off"
                                spellCheck={false}
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
                                autoComplete="off"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label className="form__label">وضعیت :</label>
                        <div className="form-control form-control-radio">
                            <div className="input-radio-wrapper">
                                <label htmlFor="active" className="radio-title">
                                    فعال
                                </label>
                                <input
                                    type="checkbox"
                                    name="status"
                                    onChange={handleOnChange}
                                    value={1}
                                    checked={Number(formData.status) === 1}
                                    id="active"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="status" className="form__label">
                            پیشنهادی :
                        </label>
                        <div className="form-control form-control-radio">
                            <div className="input-radio-wrapper">
                                <label
                                    htmlFor="suggested"
                                    className="radio-title"
                                >
                                    پیشنهاد شده
                                </label>
                                <input
                                    type="radio"
                                    name="suggestion"
                                    onChange={handleOnChange}
                                    value={1}
                                    checked={Number(formData.suggestion) === 1}
                                    id="suggested"
                                />
                            </div>

                            <div className="input-radio-wrapper">
                                <label
                                    htmlFor="not-suggested"
                                    className="radio-title"
                                >
                                    پیشنهاد نشده
                                </label>
                                <input
                                    type="radio"
                                    name="suggestion"
                                    onChange={handleOnChange}
                                    value={0}
                                    checked={Number(formData.suggestion) === 0}
                                    id="not-suggested"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="image" className="form__label">
                            عکس :
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
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ایجاد پلتفرم"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreatePlatform;
