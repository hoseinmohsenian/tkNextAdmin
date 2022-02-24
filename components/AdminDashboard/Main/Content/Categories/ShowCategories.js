import { useState } from "react";
import cstyles from "./ShowCategories.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Box from "../Elements/Box/Box";

function ShowCategories({ fetchedCategories, title, createPage, addressPage }) {
    const [categories] = useState(fetchedCategories);
    const { asPath } = useRouter();

    return (
        <div>
            <Box
                title={title}
                buttonInfo={{
                    name: "ایجاد دسته بندی",
                    url: createPage,
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">عنوان</th>
                                <th className="table__head-item">تصویر</th>
                                <th className="table__head-item">header</th>
                                <th className="table__head-item">
                                    توضیحات کوتاه
                                </th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {categories?.map((ctg, i) => (
                                <tr className="table__body-row" key={ctg?.id}>
                                    <td
                                        className={`table__body-item ${cstyles["table-item"]}`}
                                    >
                                        {ctg?.title}
                                    </td>
                                    <td
                                        className={`table__body-item ${cstyles["table-item"]}`}
                                    >
                                        <img
                                            src={ctg?.image}
                                            alt={ctg?.title}
                                            className={cstyles["category-img"]}
                                        />
                                        &nbsp; &nbsp;
                                    </td>
                                    <td
                                        className={`table__body-item ${cstyles["table-item"]}`}
                                    >
                                        {ctg?.header}
                                    </td>
                                    <td
                                        className={`table__body-item ${cstyles["table-item"]}`}
                                    >
                                        {ctg?.summary_desc}
                                    </td>
                                    <td
                                        className={`table__body-item ${cstyles["table-item"]}`}
                                    >
                                        <Link
                                            href={`${addressPage}/${ctg?.title}`}
                                        >
                                            <a className="action-btn primary">
                                                آدرس‌&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`${asPath}/${ctg?.id}/edit`}
                                        >
                                            <a className="action-btn warning">
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

export default ShowCategories;
