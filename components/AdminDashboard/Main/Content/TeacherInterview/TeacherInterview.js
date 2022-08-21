import { useState } from "react";
import Link from "next/link";
import Box from "../Elements/Box/Box";
import styles from "./TeacherInterview.module.css";
import FetchSearchSelect from "../Elements/FetchSearchSelect/FetchSearchSelect";
import API from "../../../../../api/index";
import Alert from "../../../../Alert/Alert";
import { useRouter } from "next/router";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

const teacherSchema = { id: "", name: "", family: "", mobile: "" };

function TeacherInterview({ teachers: teachersInterviews, token }) {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [loading, setLoading] = useState(false);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const router = useRouter();

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const searchTeachers = async (teacher_name) => {
        setLoading(true);
        try {
            const { data, status, response } = await API.get(
                `/admin/teacher/name/search?name=${teacher_name}`
            );

            if (status === 200) {
                setTeachers(data?.data || []);
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

    const addTeacherHandler = () => {
        if (selectedTeacher.id) {
            router.push(
                `/tkpanel/teacherInterviewsCategories/${selectedTeacher.id}`
            );
        } else {
            showAlert(true, "danger", "لطفا استاد را انتخاب کنید");
        }
    };

    return (
        <div>
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={searchTeachers}
            />
            <BreadCrumbs
                substituteObj={{
                    teacherInterviewsCategories: "مصاحبه اساتید",
                }}
            />

            <Box title="مصاحبه اساتید">
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

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {teachersInterviews?.map((teacher) => (
                                <tr
                                    className="table__body-row"
                                    key={teacher?.id}
                                >
                                    <td className="table__body-item">
                                        {teacher?.name}&nbsp;{teacher?.family}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/teacherInterviewsCategories/${teacher?.id}`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {teachersInterviews.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={2}
                                    >
                                        استادی وجود ندارد!
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

export default TeacherInterview;
