import { useState } from "react";
import Alert from "../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../../constants";
import Box from "../../../Elements/Box/Box";

function CreateStatus({ token }) {
    const [formData, setFormData] = useState({
        name: "",
        show: 1,
        next_tracking_time: 1,
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
            fd.append("show", Number(formData.show));
            fd.append(
                "next_tracking_time",
                Number(formData.next_tracking_time)
            );
            fd.append("name", formData.name);

            await addStatus(fd);
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

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const addStatus = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/tracking-log/status`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "success", "وضعیت جدید با موفقیت اضافه شد");
                router.push("/tkpanel/logReport/status");
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
            console.log("Error adding a new status", error);
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

            <Box title="ایجاد وضعیت">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="name" className="form__label">
                            نام :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="show" className={`form__label`}>
                            وضعیت نمایش :
                        </label>
                        <div className="form-control form-control-radio">
                            <div className="input-radio-wrapper">
                                <label htmlFor="show" className="radio-title">
                                    نمایان
                                </label>
                                <input
                                    type="checkbox"
                                    name="show"
                                    onChange={handleOnChange}
                                    checked={Number(formData.show) === 1}
                                    id="show"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="next_tracking_time"
                            className={`form__label`}
                        >
                            دفعه بعدی :
                        </label>
                        <div className="form-control form-control-radio">
                            <div className="input-radio-wrapper">
                                <label
                                    htmlFor="next_tracking_time"
                                    className="radio-title"
                                >
                                    دفعه بعدی
                                </label>
                                <input
                                    type="checkbox"
                                    name="next_tracking_time"
                                    onChange={handleOnChange}
                                    checked={
                                        Number(formData.next_tracking_time) ===
                                        1
                                    }
                                    id="next_tracking_time"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ثبت وضعیت"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreateStatus;
