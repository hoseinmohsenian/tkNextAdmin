import { useState } from "react";
import Box from "../../Elements/Box/Box";
import { BASE_URL } from "../../../../../../constants";
import Alert from "../../../../../Alert/Alert";
import FetchSearchSelect from "../../Elements/FetchSearchSelect/FetchSearchSelect";
import styles from "./TeachersCredit.module.css";

const teacherSchema = { id: "", name: "", family: "", mobile: "" };

function TeachersCredit({ fetchedTeachers, token }) {
    const [list, setList] = useState(fetchedTeachers);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(
        Array(fetchedTeachers?.length).fill(false)
    );

    const readTeachersCredit = async () => {
        try {
            const res = await fetch(`${BASE_URL}/admin/credit/teacher`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const { data } = await res.json();
            setList(data);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading teachers credit", error);
        }
    };

    const addTeacherHandler = async () => {
        if (selectedTeacher.id) {
            await addTeacher();
            await readTeachersCredit();
        } else {
            showAlert(true, "danger", "لطفا استاد را انتخاب نمایید");
        }
    };

    const handleLoadings = (state, i) => {
        let temp = [...loadings];
        temp[i] = state;
        setLoadings(() => temp);
    };

    const removeTeacher = async (teacher_id, i) => {
        handleLoadings(true, i);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/credit/teacher/${teacher_id}`,
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
                const filteredTeachers = list.filter(
                    (teacher) => teacher.id !== teacher_id
                );
                setList(filteredTeachers);
                showAlert(true, "danger", "این استاد حذف شد");
            }
            handleLoadings(false, i);
        } catch (error) {
            console.log("Error removing teacher", error);
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

    const addTeacher = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/credit/teacher/${selectedTeacher.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(
                    true,
                    "success",
                    `استاد ${selectedTeacher.family} اضافه شد`
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
            console.log("Error adding teacher", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div>
            <Box title="لیست اساتید اعتباری">
                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`${styles["search-row"]}`}>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label
                                    htmlFor="teacher_name"
                                    className={`form__label ${styles.form__label}`}
                                >
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
                                        fontSize={16}
                                        onSearch={(value) =>
                                            searchTeachers(value)
                                        }
                                        openBottom={true}
                                    />
                                </div>
                            </div>
                            <div className={styles["btn-wrapper"]}>
                                <button
                                    type="button"
                                    className={`btn primary ${styles["btn"]}`}
                                    disabled={loading}
                                    onClick={() => addTeacherHandler()}
                                >
                                    {loading ? "در حال جستجو ..." : "افزودن"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={removeTeacher}
                />

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام و نام خانوادگی
                                </th>
                                <th className="table__head-item">شماره تماس</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {list?.map((teacher, i) => (
                                <tr
                                    className="table__body-row"
                                    key={teacher?.id}
                                >
                                    <td className="table__body-item">
                                        {`${teacher.name} ${teacher.family}`}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher.mobile || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            className={`action-btn warning`}
                                            onClick={() =>
                                                removeTeacher(teacher.id, i)
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
                                        colSpan={4}
                                    >
                                        استادی پیدا نشد
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

export default TeachersCredit;
