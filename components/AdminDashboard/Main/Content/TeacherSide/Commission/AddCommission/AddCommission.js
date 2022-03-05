import { useEffect, useState } from "react";
import Alert from "../../../../../../Alert/Alert";
import SearchSelect from "../../../../../../SearchSelect/SearchSelect";
import { BASE_URL } from "../../../../../../../constants";
import { FaSearch } from "react-icons/fa";
import styles from "./AddCommission.module.css";

const teacherSchema = { id: "", name: "", family: "" };
const studentSchema = { id: "", name: "", family: "" };

function AddCommission({ showAlert, setIsModalOpen, token }) {
    const [formData, setFormData] = useState({
        teacher_name: "",
        commission: 0,
    });
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState({
        id: "",
        name: "",
        family: "",
    });
    const [selectedCatg1, setSelectedCatg1] = useState({
        id: "",
        title: "",
    });
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);

    const handleOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (selectedStudent.id && selectedTeacher.id && formData.commission) {
            const fd = new FormData();
            fd.append("teacher_id", selectedTeacher.id);
            fd.append("user_id", selectedStudent.id);
            fd.append("commission", formData.commission);

            await addCommission(fd);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const addCommission = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/changeable/commission`,
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
                let message = "کمیسیون جدید اضافه شد";
                showAlert(true, "success", message);
                setIsModalOpen(false);
            } else {
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error adding commission", error);
        }
    };

    const searchTeachers = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/name/search?name=${formData.teacher_name}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setTeachers(data);
                showAlert(true, "success", "اکنون استاد را انتخاب کنید");
            } else {
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error searching teachers", error);
        }
    };

    const readStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/student/${selectedTeacher.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setStudents(data);
                showAlert(true, "success", "اکنون زبان آموز را انتخاب کنید");
            } else {
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error reading students", error);
        }
    };

    useEffect(() => {
        if (selectedTeacher.id) {
            readStudents();
        }
    }, [selectedTeacher]);

    return (
        <>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <h3 className={styles["title"]}>اضافه کردن کمیسیون</h3>

            <form className="form">
                <div className="input-wrapper">
                    <label
                        htmlFor="teacher_name"
                        className={`form__label ${styles.form__label}`}
                    >
                        نام استاد :
                    </label>
                    <div className="form-control">
                        <input
                            type="text"
                            name="teacher_name"
                            id="teacher_name"
                            className="form__input"
                            onChange={handleOnChange}
                        />
                        <button
                            type="button"
                            onClick={searchTeachers}
                            disabled={!Boolean(formData.teacher_name)}
                            className={styles["search-btn"]}
                            title="جستجو استاد"
                        >
                            <FaSearch />
                        </button>
                    </div>
                </div>
                <div className="input-wrapper">
                    <label
                        htmlFor="language_id"
                        className={`form__label ${styles.form__label}`}
                    >
                        اساتید :
                    </label>
                    <div className={`form-control form-control-searchselect`}>
                        <SearchSelect
                            list={teachers}
                            defaultText="انتخاب کنید"
                            selected={selectedTeacher}
                            displayKey="family"
                            displayPattern={[
                                { member: true, key: "name" },
                                { member: false, key: " " },
                                { member: true, key: "family" },
                                { member: false, key: " - " },
                                { member: true, key: "mobile" },
                            ]}
                            setSelected={setSelectedTeacher}
                            noResText="یافت نشد"
                            listSchema={teacherSchema}
                            stylesProps={{
                                width: "100%",
                            }}
                            background="#fafafa"
                        />
                    </div>
                </div>
                <div className="input-wrapper">
                    <label
                        htmlFor="teacher_name"
                        className={`form__label ${styles.form__label}`}
                    >
                        زبان آموزان‌ :
                    </label>
                    <div className={`form-control form-control-searchselect`}>
                        <SearchSelect
                            list={students}
                            defaultText="انتخاب کنید"
                            selected={selectedStudent}
                            displayKey="title"
                            setSelected={setSelectedStudent}
                            noResText="یافت نشد"
                            listSchema={studentSchema}
                            stylesProps={{
                                width: "100%",
                            }}
                            background="#fafafa"
                        />
                    </div>
                </div>
                <div className="input-wrapper">
                    <label
                        htmlFor="commission"
                        className={`form__label ${styles.form__label}`}
                    >
                        کمیسیون :
                    </label>
                    <div className="form-control">
                        <input
                            type="number"
                            name="commission"
                            id="commission"
                            className="form__input form__input--ltr"
                            onChange={handleOnChange}
                        />
                    </div>
                </div>
                <button
                    type="button"
                    className="btn primary"
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {loading ? "در حال انجام ..." : "اضافه کردن"}
                </button>
            </form>
        </>
    );
}

export default AddCommission;
