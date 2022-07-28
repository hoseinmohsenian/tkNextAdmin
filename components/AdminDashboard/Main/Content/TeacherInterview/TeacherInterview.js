import Link from "next/link";
import Box from "../Elements/Box/Box";

function TeacherInterview({ teachers }) {
    return (
        <div>
            <Box title="مصاحبه اساتید">
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام</th>
                                <th
                                    className="table__head-item"
                                    style={{ fontSize: "1rem" }}
                                >
                                    url
                                </th>
                                <th className="table__head-item">عکس</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {teachers?.map((page) => (
                                <tr className="table__body-row" key={page?.id}>
                                    <td className="table__body-item">
                                        {page?.name}
                                    </td>
                                    <td className="table__body-item">
                                        {page?.url}
                                    </td>
                                    <td className="table__body-item">
                                        <div
                                            className="table__body-link"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            {page.image ? (
                                                <img
                                                    src={page?.image}
                                                    alt={page?.name}
                                                    height={40}
                                                    width={40}
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: "50%",
                                                        marginLeft: 10,
                                                    }}
                                                />
                                            ) : (
                                                "-"
                                            )}
                                        </div>
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/pages/${page?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/pages/${page?.id}/content`}
                                        >
                                            <a className={`action-btn primary`}>
                                                محتوا
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {teachers.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={4}
                                    >
                                        صفحه ای وجود ندارد!
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
