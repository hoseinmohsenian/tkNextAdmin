import Link from "next/link";
import Box from "../../Elements/Box/Box";

function FAQ({ faqs }) {
    return (
        <div>
            <Box
                title="سوالات FAQ"
                buttonInfo={{
                    name: "ایجاد سوال",
                    url: "/tkpanel/FaqSite/create",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">عنوان</th>
                                <th
                                    className="table__head-item"
                                    style={{ fontSize: "1rem" }}
                                >
                                    url
                                </th>
                                <th className="table__head-item">عنوان متا</th>
                                <th className="table__head-item">تصویر</th>
                                <th className="table__head-item">امتیاز</th>
                                <th className="table__head-item">
                                    شماره امتیاز
                                </th>
                                <th className="table__head-item">
                                    وضعیت نمایش
                                </th>
                                <th className="table__head-item">وضعیت پین‌</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {faqs?.map((catg) => (
                                <tr className="table__body-row" key={catg?.id}>
                                    <td className="table__body-item">
                                        {catg.title}
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.url}
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.meta_title || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <img
                                            src={catg.image}
                                            alt={catg.title}
                                            style={{ height: 40, width: 40 }}
                                        />
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.score}
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.score_number}
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.show ? "نمایش" : "عدم نمایش"}
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.pin ? "پین شده" : "پین نشده"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/FaqCategory/${catg.id}/edit`}
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

export default FAQ;
