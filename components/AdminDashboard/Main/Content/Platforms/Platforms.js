import { useState } from "react";
import Link from "next/link";
import styles from "./Platforms.module.css";
import Box from "../Elements/Box/Box";

function Platforms({ fetchedPlatforms }) {
    const [platforms] = useState(fetchedPlatforms);

    return (
        <div>
            <Box
                title="لیست پلتفرم ها"
                buttonInfo={{
                    name: "ایجاد پلتفرم",
                    url: "/tkpanel/multiplatform/create",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام پلتفرم</th>
                                <th className="table__head-item">توضیحات</th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">پیشنهادی</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {platforms?.map((pf) => (
                                <tr className="table__body-row" key={pf?.id}>
                                    <td className="table__body-item">
                                        <div className={styles["img-wrapper"]}>
                                            {pf?.image && (
                                                <img
                                                    src={pf?.image}
                                                    alt={pf?.name}
                                                    height={30}
                                                    width={30}
                                                />
                                            )}
                                            {pf?.name}
                                        </div>
                                    </td>
                                    <td className="table__body-item">
                                        {pf?.desc || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {pf?.status === 1 ? "فعال" : "غیر فعال"}
                                    </td>
                                    <td className="table__body-item">
                                        {pf?.suggestion === 1
                                            ? "پیشنهاد شده"
                                            : "پیشنهاد نشده"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/multiplatform/${pf?.id}/edit`}
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

export default Platforms;
