import { useState } from "react";
import Box from "../../Elements/Box/Box";
import Pagination from "../../Pagination/Pagination";
import { BASE_URL } from "../../../../../../constants";
import { useRouter } from "next/router";
import Link from "next/link";

function TeacherStudentLogs({
    fetchedLogs: { data, ...restData },
    token,
    type,
    id,
}) {
    const [logs, setLogs] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();

    const readSystemLogs = async (page = 1) => {
        let searchParams = {};

        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/tkpanel/multiSessionsList/logs/${id}?type=${type}`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/tracking-log?page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const {
                data: { data, ...restData },
            } = await res.json();
            setLogs(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading logs", error);
        }
    };

    return (
        <div>
            <Box
                title={`لاگ پیگیری ${
                    type === "student" ? "زبان آموز" : "استاد‌"
                }`}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام ایجاد کننده
                                </th>
                                <th className="table__head-item">
                                    نام زبان آموز
                                </th>
                                {type === "teacher" && (
                                    <th className="table__head-item">
                                        نام استاد
                                    </th>
                                )}
                                <th className="table__head-item">
                                    admin_assign_name
                                </th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">توضیحات</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {logs?.map((lg) => (
                                <tr className="table__body-row" key={lg?.id}>
                                    <td className="table__body-item">
                                        {lg.creator_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lg.user_name || "-"}
                                    </td>
                                    {type === "teacher" && (
                                        <td className="table__body-item">
                                            {lg.teacher_name || "-"}
                                        </td>
                                    )}
                                    <td className="table__body-item">
                                        {lg.admin_assign_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lg.status_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lg.desc || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/logReport/show/${lg?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/logReport/show/${lg?.id}/children`}
                                        >
                                            <a className={`action-btn primary`}>
                                                لاگ فرزند
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {logs.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={8}
                                    >
                                        لاگی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {logs.length !== 0 && (
                    <Pagination read={readSystemLogs} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default TeacherStudentLogs;
