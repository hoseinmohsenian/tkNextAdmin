import Box from "../Elements/Box/Box";
import Link from "next/link";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

function Users({ admins }) {
    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    users: "ادمین ها",
                }}
            />
            <Box
                title="لیست ادمین ها"
                buttonInfo={{
                    name: "ایجاد ادمین",
                    url: "/tkpanel/users/create",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام</th>
                                <th className="table__head-item">ایمیل</th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {admins?.map((admin) => (
                                <tr className="table__body-row" key={admin?.id}>
                                    <td className="table__body-item">
                                        {admin?.name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {admin?.email}
                                    </td>
                                    <td className="table__body-item">
                                        {admin?.status ? "فعال" : "غیرفعال"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/users/${admin?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Box>
        </div>
    );
}

export default Users;
