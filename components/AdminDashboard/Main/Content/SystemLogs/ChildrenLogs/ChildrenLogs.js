import Box from "../../Elements/Box/Box";
import Link from "next/link";

function ChildrenLogs({ logs, type }) {
    return (
        <div>
            <Box title="لاگ های فرزند">
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام ایجاد کننده
                                </th>
                                <th className="table__head-item">نام کاربر</th>
                                <th className="table__head-item">پیگیر بعدی</th>
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
                                            href={`/tkpanel/logReport/show/${lg.id}/edit?type=${type}`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/logReport/show/create?type=${type}${
                                                type !== "teacher"
                                                    ? `&user_name=${lg.user_name}&user_id=${lg.user_id}`
                                                    : ""
                                            }${
                                                type !== "student"
                                                    ? `&teacher_name=${lg.teacher_name}&teacher_id=${lg.teacher_name}`
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
            </Box>
        </div>
    );
}

export default ChildrenLogs;
