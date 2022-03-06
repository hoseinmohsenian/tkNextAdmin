import { useEffect, useState } from "react";
import styles from "./CreateScore.module.css";
import Alert from "../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../../constants";
import Box from "../../../Elements/Box/Box";
import SearchSelect from "../../../../../../SearchSelect/SearchSelect";
import { FaSearch } from "react-icons/fa";

const teacherSchema = { id: "", name: "", family: "" };
const studentSchema = { id: "", name: "", family: "" };

function CreateScore({ token }) {
    const [formData, setFormData] = useState({
        teacher_name: "",
        desc: "",
        desc: false,
        point_type: "1",
        number: "",
        teacher_side_desc: "",
        accounting_effect: false,
    });
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [selectedStudent, setSelectedStudent] = useState(studentSchema);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedTeacher.id && formData.number && formData.point_type) {
            const fd = new FormData();
            fd.append("teacher_id", selectedTeacher.id);
            fd.append("number", Number(formData.number));
            fd.append("point_type", Number(formData.point_type));
            if (
                Number(formData.point_type) === 0 &&
                formData.accounting_effect
            ) {
                fd.append(
                    "accounting_effect",
                    Number(formData.accounting_effect)
                );
            }
            if (formData.desc) {
                fd.append("desc", formData.desc);
            }
            if (formData.teacher_side_desc) {
                fd.append("teacher_side_desc", formData.teacher_side_desc);
            }
            if (selectedStudent.id) {
                fd.append("user_id", Number(selectedStudent.id));
            }

            await addScore(fd);
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

    const addScore = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/teacher/point`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                let message = "امتیاز با موفقیت ثبت شد";
                showAlert(true, "success", message);
                router.push("/score/minus/getAllScores");
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
            console.log("Error adding point", error);
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
        } else {
            setStudents([]);
        }
        setSelectedStudent(studentSchema);
    }, [selectedTeacher]);

    return (
        <form onSubmit={handleSubmit}>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={handleSubmit}
            />

            <Box title="ایجاد امتیاز برای استاد">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="teacher_name" className="form__label">
                            نام استاد :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="teacher_name"
                                id="teacher_name"
                                className="form__input"
                                onChange={handleOnChange}
                                spellCheck={false}
                                required
                                disabled={Boolean(formData?.id)}
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

                    <div className={`row ${styles["row"]}`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="language_id"
                                    className={`form__label ${styles.form__label}`}
                                >
                                    اساتید :
                                    <span className="form__star">*</span>
                                </label>
                                <div
                                    className={`form-control form-control-searchselect`}
                                >
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
                                        fontSize={16}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="language_id"
                                    className={`form__label ${styles.form__label}`}
                                >
                                    زبان آموزان‌ :
                                </label>
                                <div
                                    className={`form-control form-control-searchselect`}
                                >
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
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label htmlFor="desc" className="form__label">
                                    توضیحات :
                                </label>
                                <textarea
                                    type="text"
                                    name="desc"
                                    id="desc"
                                    className="form__textarea"
                                    onChange={handleOnChange}
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="teacher_side_desc"
                                    className="form__label"
                                >
                                    توضیحات سمت استاد :
                                </label>
                                <textarea
                                    type="text"
                                    name="teacher_side_desc"
                                    id="teacher_side_desc"
                                    className="form__textarea"
                                    onChange={handleOnChange}
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`row`}>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="point_type"
                                    className={`form__label`}
                                >
                                    نوع امتیاز :
                                    <span className="form__star">*</span>
                                </label>
                                <div className="form-control form-control-radio">
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="positive"
                                            className="radio-title"
                                        >
                                            مثبت
                                        </label>
                                        <input
                                            type="radio"
                                            name="point_type"
                                            onChange={handleOnChange}
                                            value={1}
                                            checked={
                                                Number(formData.point_type) ===
                                                1
                                            }
                                            id="positive"
                                            required
                                        />
                                    </div>
                                    <div className="input-radio-wrapper">
                                        <label
                                            htmlFor="negative"
                                            className="radio-title"
                                        >
                                            منفی
                                        </label>
                                        <input
                                            type="radio"
                                            name="point_type"
                                            onChange={handleOnChange}
                                            value={0}
                                            checked={
                                                Number(formData.point_type) ===
                                                0
                                            }
                                            id="negative"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`col-sm-6 ${styles["col"]}`}>
                            <div className="input-wrapper">
                                <label
                                    htmlFor="number"
                                    className={`form__label`}
                                >
                                    امتیاز :
                                    <span className="form__star">*</span>
                                </label>
                                <div className="form-control">
                                    <input
                                        type="number"
                                        name="number"
                                        id="number"
                                        className="form__input form__input--ltr"
                                        onChange={handleOnChange}
                                        required
                                        max={5}
                                        maxLength={1}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {Number(formData.point_type) === 0 && (
                        <div className="input-wrapper">
                            <label
                                htmlFor="accounting_effect"
                                className={`form__label`}
                            >
                                تاثیر در حسابداری :
                            </label>
                            <div className="form-control form-control-radio">
                                <div className="input-radio-wrapper">
                                    <label
                                        htmlFor="accounting_effect"
                                        className="radio-title"
                                    >
                                        داده شود
                                    </label>
                                    <input
                                        type="checkbox"
                                        name="accounting_effect"
                                        onChange={handleOnChange}
                                        checked={
                                            Number(
                                                formData.accounting_effect
                                            ) === 1
                                        }
                                        id="accounting_effect"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ایجاد "}
                    </button>
                </div>
            </Box>
        </form>
    );
}

export default CreateScore;
