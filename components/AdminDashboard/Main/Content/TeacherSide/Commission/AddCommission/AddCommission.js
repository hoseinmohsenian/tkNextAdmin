import { useEffect, useState } from "react";
import Alert from "../../../../../../Alert/Alert";
import SearchSelect from "../../../../../../SearchSelect/SearchSelect";
import styles from "./AddCommission.module.css";
import FetchSearchSelect from "../../../Elements/FetchSearchSelect/FetchSearchSelect";
import API from "../../../../../../../api/index";

const teacherSchema = { id: "", name: "", family: "" };
const studentSchema = { id: "", name_family: "" };

function AddCommission({ showAlert, setIsModalOpen, readCommissions }) {
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
    const alertData = {
        show: false,
        message: "",
        type: "",
    };
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
            fd.append("commission", Number(formData.commission));

            await addCommission(fd);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const addCommission = async (fd) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/teacher/changeable/commission`,
                fd
            );

            if (status === 200) {
                let message = "کمیسیون جدید اضافه شد";
                showAlert(true, "success", message);
                setIsModalOpen(false);
                await readCommissions();
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding commission", error);
        }
        setLoading(false);
    };

    const searchTeachers = async (teacher_name) => {
        setLoading(true);
        try {
            const { data, status, response } = await API.get(
                `/admin/teacher/name/search?name=${teacher_name}`
            );

            if (status === 200) {
                setTeachers(data?.data);
                showAlert(true, "success", "اکنون استاد را انتخاب کنید");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error searching teachers", error);
        }
        setLoading(false);
    };

    const readStudents = async () => {
        setLoading(true);
        try {
            const { data, status, response } = await API.get(
                `/admin/teacher/student/${selectedTeacher.id}`
            );

            if (status === 200) {
                setStudents(data?.data || []);
                showAlert(true, "success", "اکنون زبان آموز را انتخاب کنید");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error reading students", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedTeacher.id) {
            readStudents();
        } else {
            setStudents([]);
        }
        setSelectedStudent(studentSchema);
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
                        htmlFor="language_id"
                        className={`form__label ${styles.form__label}`}
                    >
                        استاد :<span className="form__star">*</span>
                    </label>
                    <div className={`form-control form-control-searchselect`}>
                        <FetchSearchSelect
                            list={teachers}
                            setList={setTeachers}
                            placeholder="جستجو کنید"
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
                            noResText="استادی پیدا نشد"
                            listSchema={teacherSchema}
                            stylesProps={{
                                width: "100%",
                            }}
                            background="#fafafa"
                            onSearch={(value) => searchTeachers(value)}
                            openBottom={true}
                        />
                    </div>
                </div>
                <div className="input-wrapper">
                    <label
                        htmlFor="teacher_name"
                        className={`form__label ${styles.form__label}`}
                    >
                        زبان آموز :<span className="form__star">*</span>
                    </label>
                    <div className={`form-control form-control-searchselect`}>
                        <SearchSelect
                            list={students}
                            defaultText="انتخاب کنید"
                            selected={selectedStudent}
                            displayKey="name_family"
                            setSelected={setSelectedStudent}
                            noResText="یافت نشد"
                            listSchema={studentSchema}
                            id="id"
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
                        کمیسیون :<span className="form__star">*</span>
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
