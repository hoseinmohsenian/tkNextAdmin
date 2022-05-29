import { useState } from "react";
import Link from "next/link";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import Box from "../Elements/Box/Box";

function Courses({ fetchedCourses, token }) {
    const [courses, setCourses] = useState(fetchedCourses);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(
        Array(fetchedCourses?.length).fill(false)
    );

    const deleteCourse = async (course_id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(`${BASE_URL}/admin/course/${course_id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "danger", "این کورس حذف شد");
                await readCourses();
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting course", error);
        }
    };

    const readCourses = async () => {
        try {
            const res = await fetch(`${BASE_URL}/admin/course`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const { data } = await res.json();
            setCourses(data);
        } catch (error) {
            console.log("Error reading courses", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div>
            <Box
                title="لیست کورس ها"
                buttonInfo={{
                    name: "ایجاد کورس",
                    url: "/content/course/create",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام</th>
                                <th className="table__head-item">نوع</th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">تعداد</th>
                                <th className="table__head-item">تخفیف</th>
                                <th className="table__head-item">توضیحات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {courses?.map((crs, i) => (
                                <tr className="table__body-row" key={crs?.id}>
                                    <td className="table__body-item">
                                        {crs?.name}
                                    </td>
                                    <td className="table__body-item">
                                        {crs?.type === 1 ? "آنلاین" : "آفلاین"}
                                    </td>
                                    <td className="table__body-item">
                                        {crs?.status === 1
                                            ? "خصوصی"
                                            : "نیمه خصوصی"}
                                    </td>
                                    <td className="table__body-item">
                                        {crs?.number}
                                    </td>
                                    <td className="table__body-item">
                                        {crs?.discount}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/content/course/${crs?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() =>
                                                deleteCourse(crs?.id, i)
                                            }
                                            disabled={loadings[i]}
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Box>

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={deleteCourse}
            />
        </div>
    );
}

export default Courses;
