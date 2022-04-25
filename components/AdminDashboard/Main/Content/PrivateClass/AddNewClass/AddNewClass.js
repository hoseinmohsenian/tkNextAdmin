import { useEffect, useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../constants";
import moment from "jalali-moment";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import Box from "../../Elements/Box/Box";
import SearchSelect from "../../../../../SearchSelect/SearchSelect";
import FetchSearchSelect from "../../Elements/FetchSearchSelect/FetchSearchSelect";
import styles from "./AddNewClass.module.css";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const teacherSchema = { id: "", name: "", family: "" };
const studentSchema = { id: "", name: "", family: "" };

function AddNewClass({
    token,
    languages,
    platforms,
    courses,
    day,
    freeTime: teacherFreeTime,
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
    const [calendarlInd, setCalendarlInd] = useState(0);
    const m = moment();
    const months = m._locale._jMonths;
    const weekdays = [
        "شنبه",
        "یک‌شنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنج‌شنبه",
        "جمعه",
    ];
    const calendarData = {
        startDay: m.add(calendarlInd * 7 + 1, "days").format("DD"),
        startMonth: months[m.month()],
        endDay: m.add(6, "days").format("DD"),
        endMonth: months[m.month()],
    };

    function checkIndexSelectedHour(isItemSelected, startHour, startMin) {
        for (let i = 0; i < isItemSelected.hours.length; i++) {
            if (
                isItemSelected.hours[i]["start"] === startHour &&
                isItemSelected.hours[i]["min"] === startMin
            ) {
                console.log("this is index " + i);

                return i;
            }
        }
        return -1;
    }

    const nextWeekBtn = () => {
        if (calendarlInd !== 4 - 1) {
            setCalendarlInd(calendarlInd + 1);
        }
    };
    const prevWeekBtn = () => {
        if (calendarlInd !== 0) {
            setCalendarlInd(calendarlInd - 1);
        }
    };

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

                        <div className={styles.caresoul}>
                            {/* Caresoul Navigation  */}
                            {/*<div className={styles.caresoul__navigation}>*/}
                            <div className={styles["caresoul__navigation-btn"]}>
                                <button
                                    className={`${styles["caresoul__navigation-btn"]} ${styles["caresoul__navigation-btn--prev"]}`}
                                    onClick={prevWeekBtn}
                                    disabled={calendarlInd === 0}
                                    type="button"
                                >
                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <AiOutlineRight /> هفته قبل{" "}
                                    </span>
                                </button>
                                <button
                                    className={`${styles["caresoul__navigation-btn"]} ${styles["caresoul__navigation-btn--next"]}`}
                                    onClick={nextWeekBtn}
                                    disabled={
                                        calendarlInd === 4 - 1 ? true : false
                                    }
                                    type="button"
                                >
                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        هفته بعد <AiOutlineLeft />
                                    </span>
                                </button>
                            </div>
                            {/* Caresoul Navigation  */}
                            {Object.values(teacherFreeTime).length > 0 && (
                                <div className={styles.carousel__wrapper}>
                                    {[...Array(4)].map((_, index) => {
                                        let position =
                                            styles["carousel__item--next"];

                                        if (calendarlInd === index) {
                                            position =
                                                styles[
                                                    "carousel__item--active"
                                                ];
                                        }

                                        if (
                                            calendarlInd === index - 1 ||
                                            (index === 0 && calendarlInd === 3)
                                        ) {
                                            position =
                                                styles["carousel__item--last"];
                                        }

                                        m.subtract(7, "days");

                                        return (
                                            <div
                                                className={`${styles.carousel__item} ${position} animate__animated `}
                                                key={index}
                                            >
                                                <div
                                                    className={
                                                        styles[
                                                            "carousel__item-title"
                                                        ]
                                                    }
                                                >
                                                    <span>
                                                        {calendarData.startDay}{" "}
                                                        {
                                                            calendarData.startMonth
                                                        }
                                                    </span>{" "}
                                                    تا{" "}
                                                    <span>
                                                        {calendarData.endDay}{" "}
                                                        {calendarData.endMonth}
                                                    </span>
                                                </div>

                                                <div
                                                    className={
                                                        styles[
                                                            "carousel__item-body"
                                                        ]
                                                    }
                                                >
                                                    <button
                                                        className={
                                                            styles[
                                                                "caresoul__item-week"
                                                            ]
                                                        }
                                                        //  onClick={() => setShowStepper(true)}
                                                    >
                                                        {[...Array(7)].map(
                                                            (_, ind) => {
                                                                m.set(
                                                                    "hour",
                                                                    0
                                                                );
                                                                m.set(
                                                                    "minute",
                                                                    0
                                                                );

                                                                return (
                                                                    <div
                                                                        className={
                                                                            styles[
                                                                                "caresoul__item-weekday"
                                                                            ]
                                                                        }
                                                                        key={
                                                                            ind
                                                                        }
                                                                    >
                                                                        <div
                                                                            className={
                                                                                styles[
                                                                                    "caresoul__item-weekday-date"
                                                                                ]
                                                                            }
                                                                        >
                                                                            {/* <span>
                                                                {
                                                                    weekdays[
                                                                        m
                                                                            .add(
                                                                                1,
                                                                                "days"
                                                                            )
                                                                            .weekday()
                                                                    ]
                                                                }
                                                            </span>
                                                            <span>
                                                                {m.format("DD")}
                                                            </span> */}

                                                                            <span>
                                                                                {
                                                                                    weekdays[
                                                                                        m
                                                                                            .add(
                                                                                                0,
                                                                                                "days"
                                                                                            )
                                                                                            .weekday()
                                                                                    ]
                                                                                }
                                                                            </span>
                                                                            <span>
                                                                                {m.format(
                                                                                    "DD"
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                        <ul
                                                                            className={
                                                                                styles[
                                                                                    "caresoul__item-hours"
                                                                                ]
                                                                            }
                                                                        >
                                                                            {[
                                                                                ...Array(
                                                                                    48
                                                                                ),
                                                                            ].map(
                                                                                (
                                                                                    _,
                                                                                    i
                                                                                ) => (
                                                                                    <li
                                                                                        className={
                                                                                            teacherFreeTime.includes(
                                                                                                (
                                                                                                    ind +
                                                                                                    1
                                                                                                ).toString() +
                                                                                                    i.toString()
                                                                                            )
                                                                                                ? "d-block"
                                                                                                : "d-none"
                                                                                        }
                                                                                        key={
                                                                                            i
                                                                                        }
                                                                                        onClick={(
                                                                                            e
                                                                                        ) =>
                                                                                            selectedHoursHandler(
                                                                                                e,
                                                                                                weekdays[
                                                                                                    m
                                                                                                        .subtract(
                                                                                                            7 -
                                                                                                                ind,
                                                                                                            "days"
                                                                                                        )
                                                                                                        .set(
                                                                                                            "hour",
                                                                                                            0
                                                                                                        )
                                                                                                        .set(
                                                                                                            "minute",
                                                                                                            0
                                                                                                        )
                                                                                                        .add(
                                                                                                            30 *
                                                                                                                i,
                                                                                                            "minute"
                                                                                                        )
                                                                                                        .weekday()
                                                                                                ],
                                                                                                m.format(
                                                                                                    "DD"
                                                                                                ),
                                                                                                months[
                                                                                                    m.month()
                                                                                                ],
                                                                                                m.year(),
                                                                                                m.format(
                                                                                                    "HH"
                                                                                                ),
                                                                                                m.format(
                                                                                                    "mm"
                                                                                                ),
                                                                                                m.format(
                                                                                                    " YYYY/M/D"
                                                                                                )
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <span>
                                                                                            {m.format(
                                                                                                "HH"
                                                                                            )}

                                                                                            :
                                                                                            {m.format(
                                                                                                "mm"
                                                                                            )}
                                                                                        </span>
                                                                                        <div
                                                                                            className={
                                                                                                styles[
                                                                                                    "caresoul__item-hours-hover"
                                                                                                ]
                                                                                            }
                                                                                        >
                                                                                            <span>
                                                                                                {
                                                                                                    weekdays[
                                                                                                        m.weekday()
                                                                                                    ]
                                                                                                }
                                                                                                &nbsp;
                                                                                                {m.format(
                                                                                                    "DD"
                                                                                                )}
                                                                                                &nbsp;
                                                                                                {
                                                                                                    months[
                                                                                                        m.month()
                                                                                                    ]
                                                                                                }
                                                                                            </span>
                                                                                            <span>
                                                                                                {m.format(
                                                                                                    "HH"
                                                                                                )}

                                                                                                :
                                                                                                {m.format(
                                                                                                    "mm"
                                                                                                )}
                                                                                                &nbsp;
                                                                                                تا
                                                                                                &nbsp;
                                                                                                {m.format(
                                                                                                    "HH"
                                                                                                )}

                                                                                                :
                                                                                                {m
                                                                                                    .add(
                                                                                                        30,
                                                                                                        "minutes"
                                                                                                    )
                                                                                                    .format(
                                                                                                        "mm"
                                                                                                    )}
                                                                                            </span>
                                                                                        </div>
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
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
