import { useState } from "react";
import Alert from "../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../constants";
import Box from "../Elements/Box/Box";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

function EditSkill({ token, skill }) {
    const [formData, setFormData] = useState(skill);
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
            formData.persian_name.trim() &&
            formData.english_name.trim() &&
            formData.url.trim()
        ) {
            const fd = new FormData();
            if (formData.persian_name !== skill?.persian_name) {
                fd.append("persian_name", formData.persian_name);
            }
            if (formData.english_name !== skill?.english_name) {
                fd.append("english_name", formData.english_name);
            }
            if (formData.url !== skill?.url) {
                fd.append("url", formData.url);
            }

            await editSkill(fd);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const editSkill = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teaching/skill/${formData?.id}`,
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
                showAlert(
                    true,
                    "success",
                    `مهارت ${formData?.persian_name} با موفقیت ویرایش شد`
                );
                router.push("/content/skill");
            } else {
                showAlert(true, "warning", "مشکلی پیش آمده");
            }
            setLoading(false);
        } catch (error) {
            console.log("Error editing skill", error);
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
                    content: "محتوا",
                    skill: "مهارت ها",
                    edit: "ویرایش",
                }}
            />

            <Box title="ویرایش مهارت">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="speciality_id" className="form__label">
                            تخصص :
                        </label>
                        <div className="form-control">
                            <select
                                name="speciality_id"
                                id="speciality_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.speciality_id}
                                required
                                disabled
                            >
                                <option value={formData.speciality_id}>
                                    {formData.speciality_name}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="persian_name" className="form__label">
                            نام فارسی :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="persian_name"
                                id="persian_name"
                                className="form__input"
                                onChange={handleOnChange}
                                value={formData?.persian_name}
                                autoComplete="off"
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="english_name" className="form__label">
                            نام انگلیسی :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="english_name"
                                id="english_name"
                                className="form__input"
                                onChange={handleOnChange}
                                value={formData?.english_name}
                                autoComplete="off"
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="url" className="form__label">
                            url :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="url"
                                id="url"
                                className="form__input"
                                style={{ direction: "ltr", textAlign: "right" }}
                                onChange={handleOnChange}
                                value={formData?.url}
                                autoComplete="off"
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ویرایش مهارت‌"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default EditSkill;
