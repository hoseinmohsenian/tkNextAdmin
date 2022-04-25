import { useState } from "react";
import { useGlobalContext } from "../../context";
import styles from "./AdminLogin.module.css";
import Alert from "../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../constants";

function AdminLogin() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const { setCookie } = useGlobalContext();
    const router = useRouter();

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const loginHandler = async (e) => {
        e.preventDefault();

        if (formData.email.trim() && formData.password.trim()) {
            await login();
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const login = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/admin/login`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-type": "application/json",
                },
            });
            const { data } = await res.json();
            if (data?.token) {
                showAlert(true, "success", "لاگین با موفقیت انجام شد");
                setCookie("admin_token", data?.token, 0.5);
                setCookie("admin_name", data?.name, 0.5);
                router.push("/tkpanel");
            } else {
                showAlert(true, "danger", "اطلاعات وارد شده نادرست است");
            }
            setLoading(false);
        } catch (error) {
            console.log("Error calling login API", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div className={styles.login}>
            <div className="container">
                <div className={styles["login-wrapper"]}>
                    <div className={styles.box}>
                        {/* Alert */}
                        <Alert
                            {...alertData}
                            removeAlert={showAlert}
                            envoker={login}
                        />

                        <header className={styles.login__header}>
                            <img
                                src="/images/loginLogo.png"
                                className={styles.login__logo}
                                alt="Logo"
                            />
                        </header>
                        <form className={styles.form} onSubmit={loginHandler}>
                            <div className={styles["input-wrapper"]}>
                                <label
                                    htmlFor="email"
                                    className={styles.form__label}
                                >
                                    Email
                                </label>
                                <div className={styles["form-control"]}>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className={styles.form__input}
                                        onChange={handleOnChange}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className={styles["input-wrapper"]}>
                                <label
                                    htmlFor="password"
                                    className={styles.form__label}
                                >
                                    Password
                                </label>
                                <div className={styles["form-control"]}>
                                    <button
                                        className={styles["toggle-password"]}
                                        onClick={() =>
                                            setIsPasswordShown(!isPasswordShown)
                                        }
                                        type="button"
                                    >
                                        {isPasswordShown ? `Hide` : `Show`}
                                    </button>
                                    <input
                                        type={
                                            isPasswordShown
                                                ? `text`
                                                : "password"
                                        }
                                        name="password"
                                        id="password"
                                        className={styles.form__input}
                                        onChange={handleOnChange}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`gradient--purple ${styles.btn}`}
                                disabled={loading}
                            >
                                Log in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
