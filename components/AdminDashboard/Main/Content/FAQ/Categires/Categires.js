import Link from "next/link";
import Box from "../../Elements/Box/Box";

function Categories({ categories }) {
    return (
        <div>
            <Box
                title="دسته بندی FAQ"
                buttonInfo={{
                    name: "ایجاد دسته بندی",
                    url: "/tkpanel/FaqCategory/create",
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
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {categories?.map((catg) => (
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

export default Categories;
