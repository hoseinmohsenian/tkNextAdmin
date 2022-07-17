import Link from "next/link";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";

function Landing({ landings }) {
    moment.locale("fa", { useGregorianParser: true });

    return (
        <div>
            <Box
                title="لندینگ تعاملی"
                buttonInfo={{
                    name: "ایجاد لندینگ",
                    url: "/tkpanel/landing/interactive/list/create",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">عنوان</th>
                                <th className="table__head-item">url</th>
                                <th className="table__head-item">
                                    تاریخ ایجاد
                                </th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {landings?.map((landing, i) => (
                                <tr
                                    className="table__body-row"
                                    key={landing.id}
                                >
                                    <td className="table__body-item table__body-item--ltr">
                                        {landing.title}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {landing.url}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment(landing?.created_at).format(
                                            "YYYY/MM/DD HH:mm"
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/landing/interactive/list/${landing?.id}/edit`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {landings?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={4}
                                    >
                                        لندینگی برای نمایش وجود ندارد.
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

export default Landing;
