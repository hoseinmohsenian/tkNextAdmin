import { useState } from "react";
import Box from "../Elements/Box/Box";
import { BASE_URL } from "../../../../../constants";
import FetchSearchSelect from "../Elements/FetchSearchSelect/FetchSearchSelect";
import styles from "./StudentPlacements.module.css";
import Link from "next/link";
import Alert from "../../../../Alert/Alert";

const studentSchema = { id: "", name_family: "", mobile: "", email: "" };

function StudentPlacements({ token }) {
    const [placements, setPlacements] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(studentSchema);
    const [loading, setLoading] = useState(false);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const readPlacementsHandler = async () => {
        if (selectedStudent.id) {
            await readPlacements();
        } else {
            showAlert(true, "danger", "لطفا زبان آموز را انتخاب نمایید");
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
            console.log("Error searching students", error);
        }
    };

    const readPlacements = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/student/placement?user_id=${selectedStudent.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setPlacements(data);
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
            console.log("Error reading placements", error);
        }
    };

    return (
        <div>
            <Box title="تعیین سطح زبان آموزان">
                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={readPlacementsHandler}
                />

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
                                        fontSize={16}
                                        onSearch={(value) =>
                                            searchStudents(value)
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
                                    onClick={() => readPlacementsHandler()}
                                >
                                    {loading ? "در حال جستجو ..." : "جستجو"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">سطح</th>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">زبان</th>
                                <th className="table__head-item">سطح تدریس</th>
                                <th className="table__head-item">توضیحات</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {placements?.map((user) => (
                                <tr className="table__body-row" key={user?.id}>
                                    <td className="table__body-item">
                                        {user.level_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {user.teacher_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {user.language.persian_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {user.level_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {user.desc || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/profileDetermineLevel/${user?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {placements.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={6}
                                    >
                                        تعیین سطحی پیدا نشد
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

export default StudentPlacements;