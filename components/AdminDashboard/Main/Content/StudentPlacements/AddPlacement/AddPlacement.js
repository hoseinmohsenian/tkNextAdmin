import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import Box from "../../Elements/Box/Box";
import API from "../../../../../../api";

function AddPlacement({ token, languages, levels, user }) {
    const [formData, setFormData] = useState({
        user_id: user.id,
        language_id: 0,
        teaching_level_id: 0,
    });
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            Number(formData.language_id) !== 0 &&
            Number(formData.teaching_level_id) !== 0
        ) {
            await addPlacement();
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

    const addPlacement = async () => {
        setLoading(true);
        try {
            let body = {
                user_id: formData.user_id,
                language_id: formData.language_id,
                teaching_level_id: formData.teaching_level_id,
            };
            const { response, status } = await API.post(
                `/admin/student/placement`,
                body
            );

            if (status === 200) {
                showAlert(true, "success", "تعیین سطح با موفقیت ثبت شد");
                router.push("/tkpanel/profileDetermineLevel");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding placement", error);
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

            <Box title="اضافه کردن تعیین سطح">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label htmlFor="name_family" className="form__label">
                            زبان آموز :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="name_family"
                                id="name_family"
                                className="form__input"
                                value={user.name_family || ""}
                                onChange={handleOnChange}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="language_id" className="form__label">
                            زبان :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="language_id"
                                id="language_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.language_id}
                                required
                            >
                                <option value={0}>انتخاب کنید</option>
                                {languages?.map((lan) => (
                                    <option key={lan?.id} value={lan?.id}>
                                        {lan?.persian_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label
                            htmlFor="teaching_level_id"
                            className="form__label"
                        >
                            سطح :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="teaching_level_id"
                                id="teaching_level_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.teaching_level_id}
                                required
                            >
                                <option value={0}>انتخاب کنید</option>
                                {levels?.map((lan) => (
                                    <option key={lan?.id} value={lan?.id}>
                                        {lan?.persian_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ثبت تعیین سطح"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default AddPlacement;
