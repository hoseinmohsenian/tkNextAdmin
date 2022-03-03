import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";

function CreateUser({ token }) {
    const [formData, setFormData] = useState({
        name: "",
        password: "",
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

        if (formData.email.trim() && formData.password.trim()) {
            const fd = new FormData();
            fd.append("email", formData.email);
            fd.append("password", formData.password);
            if (formData.name) {
                fd.append("name", formData.name);
            }
            await addAdmin(fd);
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

    const addAdmin = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/action/register`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "success", "ادمین جدید با موفقیت اضافه شد");
                router.push("/tkpanel/users");
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

            <Box title="ایجاد ادمین">
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
                                autoComplete="off"
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="password" className="form__label">
                            پسورد :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                autoComplete="off"
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ایجاد ادمین"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreateUser;
