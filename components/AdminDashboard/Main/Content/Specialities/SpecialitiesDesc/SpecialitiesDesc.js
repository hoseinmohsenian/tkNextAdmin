import Link from "next/link";
import Box from "../../Elements/Box/Box";

function SpecialitiesDesc({ specialitys }) {
    return (
        <div>
            <Box
                title="توضیحات تخصص ها"
                buttonInfo={{
                    name: "لیست تخصص ها",
                    url: "/content/specialty",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام زبان</th>
                                <th className="table__head-item">نام تخصص</th>
                                <th className="table__head-item">h1</th>
                                <th className="table__head-item">عنوان سئو</th>
                                <th className="table__head-item">seo key</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {specialitys?.map((spec) => (
                                <tr className="table__body-row" key={spec?.id}>
                                    <td className="table__body-item">
                                        {spec?.language_name}
                                    </td>
                                    <td className="table__body-item">
                                        {spec?.persian_name}
                                    </td>
                                    <td className="table__body-item">
                                        {spec?.h1 || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {spec?.title_seo || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {spec?.seo_key || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/content/specialty/information/desc/${spec?.id}/edit`}
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

export default SpecialitiesDesc;
