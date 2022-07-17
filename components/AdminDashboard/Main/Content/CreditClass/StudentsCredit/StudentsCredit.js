import { useState } from "react";
import Box from "../../Elements/Box/Box";
import { BASE_URL } from "../../../../../../constants";
import Alert from "../../../../../Alert/Alert";
import FetchSearchSelect from "../../Elements/FetchSearchSelect/FetchSearchSelect";
import styles from "./StudentsCredit.module.css";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";
import SearchSelect from "../../../../../SearchSelect/SearchSelect";

const teacherSchema = { id: "", name: "", family: "", mobile: "" };
const studentSchema = { id: "", name_family: "", mobile: "", email: "" };

function StudentsCredit({
    fetchedStudents: { data, ...restData },
    token,
    teachers,
}) {
    const [list, setList] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [students, setStudents] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [selectedStudent, setSelectedStudent] = useState(studentSchema);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const router = useRouter();

    const readStudentsCredit = async (page = 1) => {
        let searchParams = {};

        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/tkpanel/installment/students`,
            query: searchParams,
        });

        try {
            const res = await fetch(`${BASE_URL}/admin/credit/enable`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const {
                data: { data, ...restData },
            } = await res.json();
            setList(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading students credit", error);
        }
    };

    const addStudentHandler = async () => {
        if (selectedTeacher.id && selectedStudent.id) {
            await addStudent();
            await readStudentsCredit();
        } else {
            showAlert(
                true,
                "danger",
                "لطفا استاد و زبان آموز را انتخاب نمایید"
            );
        }
    };

    const handleLoadings = (state, i) => {
        let temp = [...loadings];
        temp[i] = state;
        setLoadings(() => temp);
    };

    const removeStudent = async (user_id, i) => {
        handleLoadings(true, i);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/credit/enable/${user_id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const filteredStudents = list.filter(
                    (user) => user.id !== user_id
                );
                setList(filteredStudents);
                showAlert(true, "danger", "این زبان آموز حذف شد");
            }
            handleLoadings(false, i);
        } catch (error) {
            console.log("Error removing student", error);
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
            console.log("Error searching teachers", error);
        }
    };

    const searchTeachers = async (teacher_name) => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/search?name=${teacher_name}`,
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

    const addStudent = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/admin/credit/enable`, {
                method: "POST",
                body: JSON.stringify({
                    user_id: selectedStudent.id,
                    teacher_id: selectedTeacher.id,
                }),
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(
                    true,
                    "success",
                    `زبان آموز ${selectedStudent.name_family} اضافه شد`
                );
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
            console.log("Error adding student", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div>
            <Box title="لیست زبان آموزان اعتباری">
                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="teacher_name"
                                        className={`form__label ${styles.form__label}`}
                                    >
                                        استاد :
                                        <span className="form__star">*</span>
                                    </label>
                                    <div
                                        className={`form-control form-control-searchselect`}
                                    >
                                        <SearchSelect
                                            list={teachers}
                                            displayKey="family"
                                            id="id"
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
                                                { member: false, key: " - " },
                                                { member: true, key: "mobile" },
                                            ]}
                                            defaultText="استاد را انتخاب کنید."
                                            selected={selectedTeacher}
                                            setSelected={setSelectedTeacher}
                                            noResText="استادی پیدا نشد"
                                            stylesProps={{
                                                width: "100%",
                                            }}
                                            background="#fafafa"
                                        />
                                        {/* <FetchSearchSelect
                                            list={teachers}
                                            setList={setTeachers}
                                            placeholder="جستجو کنید"
                                            selected={selectedTeacher}
                                            id="id"
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
                                            onSearch={(value) =>
                                                searchTeachers(value)
                                            }
                                            openBottom={true}
                                        /> */}
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="teacher_name"
                                        className={`form__label ${styles.form__label}`}
                                    >
                                        زبان آموز :
                                        <span className="form__star">*</span>
                                    </label>
                                    <div
                                        className={`form-control form-control-searchselect`}
                                    >
                                        <FetchSearchSelect
                                            list={students}
                                            setList={setStudents}
                                            placeholder="جستجو کنید"
                                            selected={selectedStudent}
                                            id="id"
                                            displayKey="name_family"
                                            displayPattern={[
                                                {
                                                    member: true,
                                                    key: "name_family",
                                                },
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
                                            onSearch={(value) =>
                                                searchStudents(value)
                                            }
                                            openBottom={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles["btn-wrapper"]}>
                            <button
                                type="button"
                                className={`btn primary ${styles["btn"]}`}
                                disabled={loading}
                                onClick={() => addStudentHandler()}
                            >
                                {loading ? "در حال جستجو ..." : "افزودن"}
                            </button>
                        </div>
                    </form>
                </div>

                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={removeStudent}
                />

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">زبان آموز</th>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {list?.map((item, i) => (
                                <tr className="table__body-row" key={item?.id}>
                                    <td className="table__body-item">
                                        {item.user_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item.teacher_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            className={`action-btn warning`}
                                            onClick={() =>
                                                removeStudent(item.id, i)
                                            }
                                            disabled={loadings[i]}
                                        >
                                            غیرفعال کردن
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {list.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={3}
                                    >
                                        زبان آموزی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {list.length !== 0 && (
                    <Pagination read={readStudentsCredit} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default StudentsCredit;
