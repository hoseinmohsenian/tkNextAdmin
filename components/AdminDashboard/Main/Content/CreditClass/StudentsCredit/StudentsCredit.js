import { useState, useEffect } from "react";
import Box from "../../Elements/Box/Box";
import Alert from "../../../../../Alert/Alert";
import styles from "./StudentsCredit.module.css";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";
import SearchSelect from "../../../../../SearchSelect/SearchSelect";
import API from "../../../../../../api";

const teacherSchema = { id: "", name: "", family: "", mobile: "" };
const studentSchema = { id: "", name_family: "", mobile: "", email: "" };

function StudentsCredit({ fetchedStudents: { data, ...restData }, teachers }) {
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
            const { data, status, response } = await API.get(
                `/admin/credit/enable`
            );

            if (status === 200) {
                const { data: listData, ...restData } = data?.data;
                setList(listData);
                setPagData(restData);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }

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
            const { status, response } = await API.delete(
                `/admin/credit/enable/${user_id}`
            );

            if (status === 200) {
                const filteredStudents = list.filter(
                    (user) => user.id !== user_id
                );
                setList(filteredStudents);
                showAlert(true, "danger", "این زبان آموز حذف شد");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error removing student", error);
        }
        handleLoadings(false, i);
    };

    const readStudents = async () => {
        setLoading(true);
        try {
            const { data, status, response } = await API.get(
                `/admin/teacher/student/${selectedTeacher.id}`
            );

            if (status === 200) {
                setStudents(data?.data || []);
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

    const addStudent = async () => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/credit/enable`,
                JSON.stringify({
                    user_id: selectedStudent.id,
                    teacher_id: selectedTeacher.id,
                })
            );

            if (status === 200) {
                showAlert(
                    true,
                    "success",
                    `زبان آموز ${selectedStudent.name_family} اضافه شد`
                );
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding student", error);
        }
        setLoading(false);
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
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
                                        <SearchSelect
                                            list={students}
                                            defaultText="انتخاب کنید"
                                            selected={selectedStudent}
                                            displayKey="name_family"
                                            id="id"
                                            setSelected={setSelectedStudent}
                                            listSchema={studentSchema}
                                            stylesProps={{
                                                width: "100%",
                                            }}
                                            background="#fafafa"
                                            displayPattern={[
                                                {
                                                    member: true,
                                                    key: "name_family",
                                                },
                                            ]}
                                            noResText="زبان آموزی پیدا نشد"
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
