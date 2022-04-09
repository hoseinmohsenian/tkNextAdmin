import Link from "next/link";
import Box from "../../Elements/Box/Box";

function LangDesc({ languages }) {
    return (
        <div>
            <Box
                title="توضیحات زبان ها"
                buttonInfo={{
                    name: "لیست زبان ها",
                    url: "/content/language",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام زبان</th>
                                <th className="table__head-item">h1</th>
                                <th className="table__head-item">عنوان سئو</th>
                                <th className="table__head-item">seo key</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {languages?.map((lan) => (
                                <tr className="table__body-row" key={lan?.id}>
                                    <td className="table__body-item">
                                        {lan?.persian_name}
                                    </td>
                                    <td className="table__body-item">
                                        {lan?.h1 || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lan?.title_seo || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lan?.seo_key || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/content/lang/des/${lan?.id}/edit`}
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

export default LangDesc;
