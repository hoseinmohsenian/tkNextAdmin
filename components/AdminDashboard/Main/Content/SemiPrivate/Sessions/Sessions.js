import { useState, useEffect } from "react";
import styles from "./Sessions.module.css";
import Link from "next/link";
import Box from "../../Elements/Box/Box";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import Alert from "../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../constants";
import FetchSearchSelect from "../../Elements/FetchSearchSelect/FetchSearchSelect";
import SearchSelect from "../../../../../SearchSelect/SearchSelect";

const teacherSchema = { id: "", name: "", family: "" };
const studentSchema = { id: "", name: "", family: "" };

function SemiPrivateSessions({ token }) {
    const [formData, setFromData] = useState({ type: 1 });
    const [teachers, setTeachers] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(studentSchema);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState([]);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    moment.locale("fa", { useGregorianParser: true });

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFromData((old) => {
            return { ...old, [name]: value };
        });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const loadingHandler = (ind, value) => {
        let temp = [...loadings];
        temp[ind] = value;
        setLoadings(() => temp);
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

    const searchStudents = async (student_name) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/student/search?input=${student_name}`,
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

    const getTeacherStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/semi-private/search/teacher/students?teacher_id=${selectedTeacher.id}`,
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

    const getStudentTeachers = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/semi-private/search/student/teachers?user_id=${selectedStudent.id}`,
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
            console.log("Error reading teachers", error);
        }
    };

    const searchSessions = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/semi-private/teacher/student/session?teacher_id=${selectedTeacher.id}&user_id=${selectedStudent.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setSessions(data);
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
            console.log("Error searching sessions", error);
        }
    };

    const searchSessionsHandler = async () => {
        if (selectedStudent.id && selectedTeacher.id) {
            await searchSessions();
        } else {
            let message = "لطفا فیلدها را تکمیل کنید‌";
            showAlert(true, "danger", message);
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

    useEffect(() => {
        setSelectedStudent(studentSchema);
        setSelectedTeacher(teacherSchema);
        setStudents([]);
        setTeachers([]);
    }, [formData.type]);

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={searchSessionsHandler}
            />

            <Box
                title="جلسات کلاس نیمه خصوصی"
                buttonInfo={{
                    name: "کلاس های نیمه خصوصی",
                    url: "/tkpanel/semi-private-admin",
                    color: "primary",
                }}
            >
                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-2 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="type"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        بر اساس :
                                        <span className="form__star">*</span>
                                    </label>
                                    <div className="form-control">
                                        <select
                                            name="type"
                                            id="type"
                                            className="form__input input-select"
                                            onChange={handleOnChange}
                                            value={formData.type}
                                            required
                                        >
                                            <option value={1}>استاد</option>
                                            <option value={2}>زبان آموز</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-5 ${styles["search-col"]}`}>
                                {Number(formData.type) === 1 ? (
                                    <div
                                        className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                    >
                                        <label
                                            htmlFor="teacher"
                                            className={`form__label ${styles["search-label"]}`}
                                        >
                                            استاد :
                                            <span className="form__star">
                                                *
                                            </span>
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
                                                    {
                                                        member: true,
                                                        key: "name",
                                                    },
                                                    { member: false, key: " " },
                                                    {
                                                        member: true,
                                                        key: "family",
                                                    },
                                                    {
                                                        member: false,
                                                        key: " - ",
                                                    },
                                                    {
                                                        member: true,
                                                        key: "mobile",
                                                    },
                                                ]}
                                                setSelected={setSelectedTeacher}
                                                noResText="استادی پیدا نشد"
                                                listSchema={teacherSchema}
                                                stylesProps={{
                                                    width: "100%",
                                                }}
                                                background="#fafafa"
                                                fontSize={16}
                                                onSearch={(value) =>
                                                    searchTeachers(value)
                                                }
                                                openBottom={true}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                    >
                                        <label
                                            htmlFor="student"
                                            className={`form__label ${styles["search-label"]}`}
                                        >
                                            زبان آموز :
                                            <span className="form__star">
                                                *
                                            </span>
                                        </label>
                                        <div
                                            className={`form-control form-control-searchselect`}
                                        >
                                            <FetchSearchSelect
                                                list={students}
                                                setList={setStudents}
                                                placeholder="جستجو کنید"
                                                selected={selectedStudent}
                                                displayKey="family"
                                                displayPattern={[
                                                    {
                                                        member: true,
                                                        key: "name",
                                                    },
                                                    { member: false, key: " " },
                                                    {
                                                        member: true,
                                                        key: "family",
                                                    },
                                                    {
                                                        member: false,
                                                        key: " - ",
                                                    },
                                                    {
                                                        member: true,
                                                        key: "mobile",
                                                    },
                                                ]}
                                                setSelected={setSelectedStudent}
                                                noResText="زبان آموزی پیدا نشد"
                                                listSchema={studentSchema}
                                                stylesProps={{
                                                    width: "100%",
                                                }}
                                                background="#fafafa"
                                                fontSize={16}
                                                onSearch={(value) =>
                                                    searchStudents(value)
                                                }
                                                openBottom={true}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={`col-sm-5 ${styles["search-col"]}`}>
                                {Number(formData.type) === 1 ? (
                                    <div
                                        className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                    >
                                        <label
                                            htmlFor="student"
                                            className={`form__label ${styles["search-label"]}`}
                                        >
                                            زبان آموز :
                                            <span className="form__star">
                                                *
                                            </span>
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
                                                openBottom={true}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                    >
                                        <label
                                            htmlFor="teacher"
                                            className={`form__label ${styles["search-label"]}`}
                                        >
                                            استاد :
                                            <span className="form__star">
                                                *
                                            </span>
                                        </label>
                                        <div
                                            className={`form-control form-control-searchselect`}
                                        >
                                            <SearchSelect
                                                list={teachers}
                                                defaultText="انتخاب کنید"
                                                selected={selectedTeacher}
                                                displayKey="title"
                                                setSelected={setSelectedTeacher}
                                                noResText="یافت نشد"
                                                listSchema={teacherSchema}
                                                stylesProps={{
                                                    width: "100%",
                                                }}
                                                background="#fafafa"
                                                openBottom={true}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles["btn-wrapper"]}>
                            <button
                                type="button"
                                className={`btn primary ${styles["btn"]}`}
                                disabled={loading}
                                onClick={() => searchSessionsHandler()}
                                title="جستجو جلسات"
                            >
                                {loading ? "در حال انجام ..." : "جستجو"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">عنوان</th>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">زبان‌</th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {sessions?.map((session, i) => (
                                <tr
                                    className="table__body-row"
                                    key={session.id}
                                >
                                    <td className="table__body-item">
                                        {session.title}
                                    </td>
                                    <td className="table__body-item">
                                        {session.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {/* {session.language_name} */}
                                        {session.language_id}
                                    </td>
                                    <td className="table__body-item">
                                        {session.status === 1
                                            ? "فعال"
                                            : "غیرفعال"}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment
                                            .from(
                                                session.created_at,
                                                "en",
                                                "YYYY/MM/DD hh:mm:ss"
                                            )
                                            .locale("fa")
                                            .format("YYYY/MM/DD hh:mm:ss")}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/semi-private-admin/${session?.id}/edit`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/semi-private-admin/${session?.id}/sessions`}
                                        >
                                            <a className={`action-btn warning`}>
                                                جلسات
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {sessions.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={2}
                                    >
                                        جلسه ای پیدا نشد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>
        </div>
    );
}

export default SemiPrivateSessions;
