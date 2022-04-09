import Link from "next/link";
import Box from "../../Elements/Box/Box";

function SkillsDesc({ skills }) {
    return (
        <div>
            <Box
                title="توضیحات مهارت ها"
                buttonInfo={{
                    name: "لیست مهارت ها",
                    url: "/content/skill",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">عنوان تخصص</th>
                                <th className="table__head-item">
                                    عنوان مهارت
                                </th>
                                <th className="table__head-item">h1</th>
                                <th className="table__head-item">عنوان سئو</th>
                                <th className="table__head-item">seo key</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {skills?.map((sk) => (
                                <tr className="table__body-row" key={sk?.id}>
                                    <td className="table__body-item">
                                        {sk?.speciality_name}
                                    </td>
                                    <td className="table__body-item">
                                        {sk?.persian_name}
                                    </td>
                                    <td className="table__body-item">
                                        {sk?.h1 || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {sk?.title_seo || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {sk?.seo_key || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/content/skill/description/inf/${sk?.id}/edit`}
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

export default SkillsDesc;
