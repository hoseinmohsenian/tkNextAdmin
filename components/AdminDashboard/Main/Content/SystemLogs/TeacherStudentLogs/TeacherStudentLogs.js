import { useState } from "react";
import Box from "../../Elements/Box/Box";
import Pagination from "../../Pagination/Pagination";
import { BASE_URL } from "../../../../../../constants";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "jalali-moment";

function TeacherStudentLogs({
    fetchedLogs: { data, ...restData },
    token,
    type,
    id,
    name,
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
            pathname: `/tkpanel/multiSessionsList/logs/${id}`,
            query: { type, ...searchParams },
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/tracking-log?page=${page}&${
                    type === "student" ? `user_id` : "teacher_id"
                }=${id}`,
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
                title={`تاریخچه لاگ‌ ${
                    type === "student" ? "زبان‌آموز" : "استاد‌"
                } «${name}»`}
                buttonInfo={{
                    name: "لاگ جدید",
                    url: `/tkpanel/logReport/show/create?type=${type}${
                        type !== "teacher"
                            ? `&user_name=${name}&user_id=${id}`
                            : ""
                    }${
                        type !== "student"
                            ? `&teacher_name=${name}&teacher_id=${id}`
                            : ""
                    }`,
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    ایجاد کننده
                                </th>
                                <th className="table__head-item">زبان آموز</th>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">پیگیر بعدی</th>
                                <th className="table__head-item">
                                    تاریخ پیگیر بعدی
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
                                    <td className="table__body-item">
                                        {lg.teacher_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lg.admin_assign_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lg?.next_tracking_time
                                            ? `${moment
                                                  .from(
                                                      lg.next_tracking_time
                                                          ?.substr(0, 10)
                                                          .replace("-", "/")
                                                          .replace("-", "/"),
                                                      "en",
                                                      "YYYY/MM/DD"
                                                  )
                                                  .locale("fa")
                                                  .format(
                                                      "DD MMMM YYYY"
                                                  )} , ${lg.next_tracking_time?.substr(
                                                  11,
                                                  5
                                              )}`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lg.status_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lg.desc || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/logReport/show/${lg.id}/edit?type=${type}`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/logReport/show/create?type=${type}${
                                                type !== "teacher"
                                                    ? `&user_name=${name}&user_id=${id}`
                                                    : ""
                                            }${
                                                type !== "student"
                                                    ? `&teacher_name=${name}&teacher_id=${id}`
                                                    : ""
                                            }&parent_id=${lg.id}`}
                                        >
                                            <a
                                                className={`action-btn primary`}
                                                target="_blank"
                                            >
                                                ادامه لاگ&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/logReport/show/${lg.id}/children?type=${type}`}
                                        >
                                            <a
                                                className={`action-btn primary`}
                                                target="_blank"
                                            >
                                                لاگ های فرزند
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
