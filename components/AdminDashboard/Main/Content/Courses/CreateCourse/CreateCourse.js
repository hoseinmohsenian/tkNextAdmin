import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";

function CreateCourse({ token }) {
    const [formData, setFormData] = useState({
        name: "",
        type: 1,
        number: "",
        status: 1,
        discount: "",
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

        if (
            Number(formData.type) !== 0 &&
            formData.number &&
            formData.name.trim() &&
            Number(formData.status) !== 0
        ) {
            await addCourse();
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

    const addCourse = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/course`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "success", "کورس جدید با موفقیت اضافه شد");
                router.push("/content/course");
            } else {
                showAlert(true, "warning", "مشکلی پیش آمده");
            }
            setLoading(false);
        } catch (error) {
            console.log("Error adding a new course", error);
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

            <Box title="ایجاد مدل رزرو">
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
                                autoComplete="off"
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="number" className="form__label">
                            تعداد :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="number"
                                name="number"
                                id="number"
                                className="form__input"
                                onChange={handleOnChange}
                                autoComplete="off"
                                spellCheck={false}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="discount" className="form__label">
                            تخفیف :
                        </label>
                        <div className="form-control">
                            <input
                                type="number"
                                name="discount"
                                id="discount"
                                className="form__input"
                                onChange={handleOnChange}
                                autoComplete="off"
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="type" className="form__label">
                            نوع :<span className="form__star">*</span>
                        </label>
                        <div className="form-control form-control-radio">
                            <div className="input-radio-wrapper">
                                <label htmlFor="online" className="radio-title">
                                    آنلاین
                                </label>
                                <input
                                    type="radio"
                                    name="type"
                                    onChange={handleOnChange}
                                    value={1}
                                    checked={Number(formData.type) === 1}
                                    id="online"
                                />
                            </div>

                            <div className="input-radio-wrapper">
                                <label
                                    htmlFor="offline"
                                    className="radio-title"
                                >
                                    آفلاین
                                </label>
                                <input
                                    type="radio"
                                    name="type"
                                    onChange={handleOnChange}
                                    value={2}
                                    checked={Number(formData.type) === 2}
                                    id="offline"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="status" className="form__label">
                            وضعیت :<span className="form__star">*</span>
                        </label>
                        <div className="form-control form-control-radio">
                            <div className="input-radio-wrapper">
                                <label
                                    htmlFor="private"
                                    className="radio-title"
                                >
                                    خصوصی
                                </label>
                                <input
                                    type="radio"
                                    name="status"
                                    onChange={handleOnChange}
                                    value={1}
                                    checked={Number(formData.status) === 1}
                                    id="private"
                                />
                            </div>

                            <div className="input-radio-wrapper">
                                <label
                                    htmlFor="semi-private"
                                    className="radio-title"
                                >
                                    نیمه خصوصی
                                </label>
                                <input
                                    type="radio"
                                    name="status"
                                    onChange={handleOnChange}
                                    value={2}
                                    checked={Number(formData.status) === 2}
                                    id="semi-private"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ایجاد مدل"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default CreateCourse;
