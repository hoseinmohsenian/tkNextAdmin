import Box from "../../Elements/Box/Box";
import Link from "next/link";

function ChildrenLogs({ logs }) {
    return (
        <div>
            <Box
                title="لاگ های فرزند"
                buttonInfo={{
                    name: "لاگ ها",
                    url: "/tkpanel/logReport/show",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام ایجاد کننده
                                </th>
                                <th className="table__head-item">نام کاربر</th>
                                <th className="table__head-item">
                                    admin_assign_name
                                </th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">توضیحات</th>
                                <th className="table__head-item">آیدی استاد</th>
                                <th className="table__head-item">
                                    آیدی زبان آموز
                                </th>
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
                                        {lg.teacher_id || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lg.user_id || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/logReport/show/${lg?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
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
