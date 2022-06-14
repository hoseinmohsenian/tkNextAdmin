import { useEffect, useState } from "react";
import styles from "./PinTeacher.module.css";
import Alert from "../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../constants";
import SearchMultiSelect from "../../../../SearchMultiSelect/SearchMultiSelect";
import Box from "../Elements/Box/Box";

function PinTeacher({ token, languages }) {
    const [formData, setFormData] = useState({
        language_id: 1,
    });
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        router.push("/tkpanel/showPinTeachers");
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const readTeachers = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/blog/pin/search/teacher/${formData.language_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setTeachers(data);
            setLoading(false);
        } catch (error) {
            console.log("Error reading teachers", error);
        }
    };

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const deleteTeacherPin = async (teacher_id) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/blog/pin/language/${formData.language_id}?teacher_id=${teacher_id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = "پین حذف شد";
                showAlert(true, "danger", message);
            } else {
                showAlert(true, "warning", "مشکلی پیش آمده");
            }
            setLoading(false);
        } catch (error) {
            console.log("Error deleting teacher pin", error);
        }
    };

    const pinTeacher = async (teacher_id) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/blog/pin/language/${formData.language_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ teacher_id: teacher_id }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = "این استاد پین شد";
                showAlert(true, "success", message);
            } else {
                showAlert(true, "warning", "مشکلی پیش آمده");
            }
            setLoading(false);
        } catch (error) {
            console.log("Error pinning teacher", error);
        }
    };

    const deleteTeacherHandler = async (teacher_id) => {
        await deleteTeacherPin(teacher_id);
    };

    const pinTeacherHandler = async (teacher_id) => {
        await pinTeacher(teacher_id);
    };

    useEffect(() => {
        if (formData.language_id) {
            readTeachers();
            setSelectedTeachers([]);
        }
    }, [formData.language_id]);

    return (
        <form onSubmit={handleSubmit}>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title="پین کردن استاد">
                <div className={styles.form}>
                    <div className="input-wrapper">
                        <label htmlFor="language_id" className="form__label">
                            زبان :
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
                                {languages?.map((lan) => (
                                    <option key={lan?.id} value={lan?.id}>
                                        {lan?.persian_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="title" className="form__label">
                            اساتید :
                        </label>
                        <div
                            className={`form-control form-control-searchselect`}
                        >
                            <SearchMultiSelect
                                list={teachers}
                                defaultText="انتخاب کنید"
                                id="id"
                                selected={selectedTeachers}
                                setSelected={setSelectedTeachers}
                                displayKey="teacher_name"
                                noResText="یافت نشد"
                                width="100%"
                                stylesProps={{ width: "100%" }}
                                background="#fafafa"
                                max={Infinity}
                                onRemove={deleteTeacherHandler}
                                onAdd={pinTeacherHandler}
                                showAlert={showAlert}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`primary btn`}
                        disabled={loading}
                    >
                        {loading ? "لطفا صبر کنید" : "اتمام"}
                    </button>
                </div>
            </Box>
        </form>
    );
}

export default PinTeacher;
