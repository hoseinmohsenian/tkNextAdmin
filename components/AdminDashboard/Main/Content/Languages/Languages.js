import Link from "next/link";
import Box from "../Elements/Box/Box";

function Languages({ languages }) {
    return (
        <div>
            <Box
                title="لیست زبان ها"
                buttonInfo={{
                    name: "ایجاد زبان",
                    url: "/content/language/create",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام فارسی زبان
                                </th>
                                <th className="table__head-item">
                                    نام انگلیسی زبان
                                </th>
                                <th
                                    className="table__head-item"
                                    style={{ fontSize: "1rem" }}
                                >
                                    url
                                </th>
                                <th className="table__head-item">تصویر پرچم</th>
                                <th className="table__head-item">توضیحات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {languages?.map((lan) => (
                                <tr className="table__body-row" key={lan?.id}>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/content/language/${lan?.id}/edit`}
                                        >
                                            <a className="table__body-link">
                                                {lan?.persian_name}
                                            </a>
                                        </Link>
                                    </td>
                                    <td className="table__body-item">
                                        {lan?.english_name}
                                    </td>
                                    <td className="table__body-item">
                                        {lan?.url}
                                    </td>
                                    <td className="table__body-item">
                                        {lan?.flag_image}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/content/language/${lan?.id}`}
                                        >
                                            <a className={`action-btn primary`}>
                                                افزودن&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/content/language/${lan?.id}/edit`}
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

export default Languages;
