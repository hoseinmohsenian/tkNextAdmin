import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";

function EditPlacement({ levels, token, placement }) {
    const [formData, setFormData] = useState(placement);
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
        fd.append("teaching_level_id", Number(formData.teaching_level_id));
        fd.append("desc", formData.desc);

        await editPlacement(fd);
    };

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const editPlacement = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/student/placement/${formData?.id}`,
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
                showAlert(true, "success", "تعیین سطح ویرایش شد");
                router.push("/tkpanel/profileDetermineLevel");
            } else {
                showAlert(true, "warning", "مشکلی پیش آمده");
            }
            setLoading(false);
        } catch (error) {
            console.log("Error editing placement", error);
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
            <Box title="ویرایش تعیین سطح">
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-wrapper">
                        <label
                            htmlFor="teaching_level_id"
                            className="form__label"
                        >
                            سطح تدریس :
                        </label>
                        <div className="form-control">
                            <select
                                name="teaching_level_id"
                                id="teaching_level_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.teaching_level_id}
                            >
                                {levels.map((level) => (
                                    <option key={level.id} value={level.id}>
                                        {level?.persian_name}
                                    </option>
                                ))}
                            </select>
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
                                value={formData?.desc || ""}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="teacher_name" className="form__label">
                            نام استاد :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="teacher_name"
                                id="teacher_name"
                                className="form__input"
                                onChange={handleOnChange}
                                value={formData?.teacher_name || ""}
                                disabled
                                required
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="language" className="form__label">
                            زبان :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="language"
                                id="language"
                                className="form__input"
                                onChange={handleOnChange}
                                value={formData.language?.persian_name || ""}
                                disabled
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ویرایش"}
                    </button>
                </form>
            </Box>
        </div>
    );
}

export default EditPlacement;
