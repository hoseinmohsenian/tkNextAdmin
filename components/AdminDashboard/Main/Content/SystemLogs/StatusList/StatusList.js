import Box from "../../Elements/Box/Box";
import Pagination from "../../Pagination/Pagination";
import Link from "next/link";

function StatusList({ statusData, token }) {
    return (
        <div>
            <Box
                title="وضعیت های لاگ سیستم"
                buttonInfo={{
                    name: "ایجاد وضعیت",
                    url: "/tkpanel/logReport/status/create",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام</th>
                                <th className="table__head-item">
                                    وضعیت نمایش
                                </th>
                                <th className="table__head-item">
                                    next_tracking_time
                                </th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {statusData?.map((status) => (
                                <tr
                                    className="table__body-row"
                                    key={status?.id}
                                >
                                    <td className="table__body-item">
                                        {status.name}
                                    </td>
                                    <td className="table__body-item">
                                        {status.show ? "نمایان" : "پنهان"}
                                    </td>
                                    <td className="table__body-item">
                                        {status.next_tracking_time ? "1" : "0"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/logReport/status/${status?.id}/edit`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {statusData.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={4}
                                    >
                                        وضعیتی پیدا نشد
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

export default StatusList;
