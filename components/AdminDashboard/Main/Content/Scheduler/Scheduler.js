import { useEffect, useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../constants";
import moment from "jalali-moment";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import Box from "../../Elements/Box/Box";
import SearchSelect from "../../../../../SearchSelect/SearchSelect";
import FetchSearchSelect from "../../Elements/FetchSearchSelect/FetchSearchSelect";
import dynamic from "next/dynamic";
const Scheduler = dynamic(() => import("./Scheduler/Scheduler"), {
    ssr: false,
});

const teacherSchema = { id: "", name: "", family: "" };
const studentSchema = { id: "", name: "", family: "" };

function AddNewClass({
    token,
    languages,
    platforms,
    courses,
    day,
    schedulerData,
}) {
    const [formData, setFormData] = useState({});
    const [teachers, setTeachers] = useState([]);
    let data = day;
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState({
        id: "",
        name: "",
        family: "",
    });
    const [loading, setLoading] = useState(false);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    moment.locale("fa", { useGregorianParser: true });

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            selectedTeacher.id &&
            selectedStudent.id &&
            formData.language_id &&
            formData.course_id &&
            formData.time &&
            formData.platform_id
        ) {
            const fd = new FormData();
            fd.append("teacher_id", selectedTeacher.id);
            fd.append("user_id", selectedStudent.id);
            fd.append("language_id", Number(formData.language_id));
            fd.append("course_id", Number(formData.course_id));
            fd.append("time", Number(formData.time));
            fd.append("platform_id", Number(formData.platform_id));

            // ************************* APPEND DATA

            await createClass(fd);
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

    const searchTeachers = async (teacher_name) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/name/search?name=${teacher_name}`,
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

    const createClass = async (fd) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/classroom/create`, {
                method: "POST",
                body: fd,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "success", "کلاس با موفقیت ست شد");
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
            console.log("Error creating class", error);
        }
    };
    const logDataUpdate = (action, ev, id) => {
        const message = `event ${action}: ${new Date(
            ev.start_date
        ).toLocaleDateString()} ${new Date(ev.end_date).toLocaleTimeString(
            navigator.language,
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        )}  `;
        console.log(message);
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

            <Box title="ست کردن کلاس جدید">
                <div className="form">
                    <div className="input-wrapper">
                        <label htmlFor="language_id" className={`form__label`}>
                            استاد :<span className="form__star">*</span>
                        </label>
                        <div
                            className={`form-control form-control-searchselect`}
                        >
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
                                fontSize={16}
                                onSearch={(value) => searchTeachers(value)}
                            />
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="teacher_name" className={`form__label`}>
                            زبان آموز :<span className="form__star">*</span>
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
                                {languages?.map((lan) => (
                                    <option key={lan?.id} value={lan?.id}>
                                        {lan?.persian_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="platform_id" className="form__label">
                            پلتفرم :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="platform_id"
                                id="platform_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.platform_id}
                                required
                            >
                                {platforms?.map((platform) => (
                                    <option
                                        key={platform?.id}
                                        value={platform?.id}
                                    >
                                        {platform?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="course_id" className="form__label">
                            نوع جلسه :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="course_id"
                                id="course_id"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.course_id}
                                required
                            >
                                {courses?.map((course) => (
                                    <option key={course?.id} value={course?.id}>
                                        {course?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="session_time" className="form__label">
                            مدت زمان :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            {/* <input
                                type="number"
                                name="session_time"
                                id="session_time"
                                className="form__input form__input--ltr"
                                onChange={handleOnChange}
                                value={formData.session_time}
                                placeholder="دقیقه"
                            /> */}
                            <select
                                name="session_time"
                                id="session_time"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.session_time}
                                required
                            >
                                <option value={30}>30 دقیقه</option>
                                <option value={30}>60 دقیقه</option>
                                <option value={30}>90 دقیقه</option>
                                <option value={30}>120 دقیقه</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="session_time" className="form__label">
                            تقویم مدرس:
                        </label>

                        <div style={{ height: "80vh", width: "80vw" }}>
                            <Scheduler
                                dataFromServer={schedulerData}
                                events={data}
                                timeFormatState={true}
                                onDataUpdated={logDataUpdate}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn primary"
                        disabled={loading}
                    >
                        {loading ? "در حال انجام ..." : "ثبت کلاس"}
                    </button>
                </div>
            </Box>
        </form>
    );
}

export default AddNewClass;
