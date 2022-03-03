import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";

function EditUser({ token, admin }) {
    const [formData, setFormData] = useState(admin);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        for (const key in formData) {
            if (admin[key] !== formData[key] && formData[key]) {
                fd.append(key, formData[key]);
            }
        }
        await editAdmin(fd);
    };

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const editAdmin = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/action/edit/${formData.id}`,
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
                showAlert(true, "success", "ادمین با موفقیت ویرایش شد");
                router.push("/tkpanel/users");
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
            console.log("Error adding a new admin", error);
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

            <Box title="ویرایش ادمین">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="name" className="form__label">
                            نام :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form__input"
                                onChange={handleOnChange}
                                value={formData.name || ""}
                                autoComplete="off"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="email" className="form__label">
                            ایمیل :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                value={formData.email}
                                autoComplete="off"
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="password" className="form__label">
                            پسورد :
                        </label>
                        <div className="form-control">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                value={formData.password}
                                autoComplete="off"
                                spellCheck={false}
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
                                value={formData.desc || ""}
                                autoComplete="off"
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ویرایش ادمین"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default EditUser;
