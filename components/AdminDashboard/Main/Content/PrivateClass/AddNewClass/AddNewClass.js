import { useEffect, useState } from "react";
import Alert from "../../../../../Alert/Alert";
import moment from "jalali-moment";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import Box from "../../Elements/Box/Box";
import FetchSearchSelect from "../../Elements/FetchSearchSelect/FetchSearchSelect";
import { useRouter } from "next/router";
import Caresoul from "../../../../../Carousel/Carousel";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";
import { useGlobalContext } from "../../../../../../context";
import {
    checkValidPriceKeys,
    getFormattedPrice,
    getUnformattedPrice,
} from "../../../../../../utils/priceFormat";

const teacherSchema = { id: "", name: "", family: "" };
const studentSchema = { id: "", name_family: "", mobile: "" };

function AddNewClass({ token, courses }) {
    const [formData, setFormData] = useState({
        language_id: 1,
        course_id: 1,
        time: 30,
        data: {},
        price: 0,
    });
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [students, setStudents] = useState([]);
    const [selectedHours, setSelectedHours] = useState([]);
    const [teacherFreeTime, setTeacherFreeTime] = useState({});
    const [languages, setLanguages] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState({
        id: "",
        name_family: "",
    });
    const [loading, setLoading] = useState(false);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    moment.locale("fa", { useGregorianParser: true });
    const router = useRouter();
    const { getKeyfromHourandMin } = useGlobalContext();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
            selectedHours.length !== 0
        ) {
            let body = {
                teacher_id: selectedTeacher.id,
                user_id: selectedStudent.id,
                language_id: Number(formData.language_id),
                course_id: Number(formData.course_id),
                time: Number(formData.time),
            };
            let price = Number(getUnformattedPrice(formData.price));
            if (price) {
                body = {
                    ...body,
                    price: price,
                };
            }

            let modifyhour = selectedHours.map((item) => ({
                date: moment(
                    item.allDay.toString().replace(" ", ""),
                    "YYYY/MM/DD"
                )
                    .locale("en")
                    .format("YYYY-MM-DD"),
                ids: item.hours.map((hour) =>
                    getKeyfromHourandMin(hour.start, hour.min)
                ),
            }));
            let data = {};
            modifyhour.map((item) => {
                let index = Object.keys(data).findIndex(
                    (element) => element == item.date
                );
                // console.log(index)
                if (index === -1) {
                    data[item.date] = {
                        0: item.ids,
                    };
                } else {
                    let length = Object.keys(data[item.date]).length;
                    data[item.date][length] = item.ids;
                }
            });
            body = { ...body, data };

            await createClass(body);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;

        let updatedFormData = { ...formData, [name]: value };

        // if course_id is testing session
        if (name === "course_id") {
            if (value === "1") {
                updatedFormData = { ...updatedFormData, time: 30 };
            } else {
                updatedFormData = { ...updatedFormData, time: 60 };
            }
        }
        setFormData(updatedFormData);
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
            console.log("Error searching teachers", error);
        }
    };

    const searchStudents = async (input) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/student/search?input=${input}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const {
                    data: { data },
                } = await res.json();
                setStudents(data);
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

    const formatNumber = (number) =>
        number.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });

    const readTeacherFreeTime = async (weekInd = 0) => {
        setLoading(true);

        const today = new Date();
        const futureDay = new Date();
        futureDay.setDate(today.getDate() + weekInd * 7 + 1);
        let start = `${formatNumber(futureDay.getFullYear())}-${formatNumber(
            futureDay.getMonth() + 1
        )}-${formatNumber(futureDay.getDate())}`;

        try {
            const res = await fetch(
                `${BASE_URL}/data/teacher/time/free?teacher_id=${selectedTeacher.id}&start=${start}`,
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setTeacherFreeTime(data);
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
            console.log("Error reading teacher freetime", error);
        }
    };

    const createClass = async (body) => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/classroom/create`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "success", "کلاس با موفقیت ایجاد شد");
                router.push("/tkpanel/teacher/request/lists");
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

    const readTeacherLanguages = async () => {
        setLoading(true);

        try {
            const res = await fetch(
                `${BASE_URL}/data/teacher/language?teacher_id=${selectedTeacher.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setLanguages(data);
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
            console.log("Error reading teacher languages", error);
        }
    };

    useEffect(() => {
        if (selectedTeacher.id) {
            readTeacherFreeTime();
            readTeacherLanguages();
        } else {
            setTeacherFreeTime({});
            setLanguages([]);
        }
        setSelectedHours([]);
        setFormData({ ...formData, language_id: 0 });
    }, [selectedTeacher]);

    return (
        <form onSubmit={handleSubmit}>
            <BreadCrumbs
                substituteObj={{
                    newTeacher: "کلاس",
                    addStudent: "ست کردن کلاس جدید",
                }}
            />

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
                                fontSize={14.4}
                                onSearch={(value) => searchTeachers(value)}
                                id="id"
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
                            <FetchSearchSelect
                                list={students}
                                setList={setStudents}
                                placeholder="جستجو کنید"
                                selected={selectedStudent}
                                displayKey="name_family"
                                displayPattern={[
                                    { member: true, key: "name_family" },
                                    { member: false, key: " - " },
                                    { member: true, key: "mobile" },
                                ]}
                                setSelected={setSelectedStudent}
                                noResText="زبان آموزی پیدا نشد"
                                listSchema={studentSchema}
                                stylesProps={{
                                    width: "100%",
                                }}
                                background="#fafafa"
                                fontSize={14.4}
                                onSearch={(value) => searchStudents(value)}
                                id="id"
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
                        <label htmlFor="time" className="form__label">
                            مدت زمان :<span className="form__star">*</span>
                        </label>
                        <div className="form-control">
                            <select
                                name="time"
                                id="time"
                                className="form__input input-select"
                                onChange={handleOnChange}
                                value={formData.time}
                                required
                            >
                                <option value={30}>30 دقیقه</option>
                                <option value={60}>60 دقیقه</option>
                                <option value={90}>90 دقیقه</option>
                                <option value={120}>120 دقیقه</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="price" className="form__label">
                            قیمت :
                        </label>
                        <div className="form-control">
                            <input
                                type="text"
                                name="price"
                                id="price"
                                className="form__input form__input--ltr"
                                autoComplete="off"
                                onKeyDown={(e) => checkValidPriceKeys(e)}
                                onChange={handleOnChange}
                                value={getFormattedPrice(formData.price)}
                            />
                            تومان
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="time" className="form__label">
                            تقویم مدرس:<span className="form__star">*</span>
                        </label>

                        <Caresoul
                            selectedHours={selectedHours}
                            setSelectedHours={setSelectedHours}
                            teacherFreeTime={teacherFreeTime}
                            time={formData.time}
                            course_id={formData.course_id}
                            readTeacherFreeTime={readTeacherFreeTime}
                            showAlert={showAlert}
                        />
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
