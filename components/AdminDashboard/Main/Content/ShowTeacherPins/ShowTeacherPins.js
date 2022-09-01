import { useState } from "react";
import Box from "../Elements/Box/Box";
import { BASE_URL } from "../../../../../constants";
import Alert from "../../../../Alert/Alert";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

function ShowTeacherPins({ teachers: fetchedTeachers, token }) {
    const [loadings, setLoadings] = useState(
        Array(fetchedTeachers?.length).fill(false)
    );
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [teachers, setTeachers] = useState(fetchedTeachers);

    const deleteTeacherPin = async (teacher_id, language_id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/blog/pin/language/${language_id}?teacher_id=${teacher_id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = "پین حذف شد";
                showAlert(true, "danger", message);
                removeTeacherFromList(teacher_id);
            } else {
                showAlert(true, "warning", "مشکلی پیش آمده");
            }
            temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting teacher pin", error);
        }
    };

    const removeTeacherFromList = (teacher_id) => {
        let res = teachers.filter(
            (teacher) => teacher.teacher_id !== teacher_id
        );
        setTeachers(res);
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={deleteTeacherPin}
            />

            <BreadCrumbs
                substituteObj={{
                    showPinTeachers: "اساتید پین شده",
                }}
            />

            <Box
                title="لیست اساتید پین شده"
                buttonInfo={{
                    name: "ایجاد پین",
                    url: "/tkpanel/pinTeacher",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">نام زبان</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {teachers?.map((teacher, i) => (
                                <tr
                                    className="table__body-row"
                                    key={teacher?.teacher_id}
                                >
                                    <td className="table__body-item">
                                        {teacher.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher.language_name}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() =>
                                                deleteTeacherPin(
                                                    teacher?.teacher_id,
                                                    teacher?.language_id,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {teachers?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={3}
                                    >
                                        استادی پین نشده است
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

export default ShowTeacherPins;
