import Link from "next/link";
import Box from "../Elements/Box/Box";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";
import { AiFillEye } from "react-icons/ai";

function SitePages({ pages }) {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    pages: "صفحات سایت",
                }}
            />
            <Box
                title="صفحات سایت"
                buttonInfo={{
                    name: "صفحه جدید",
                    url: "/tkpanel/pages/create",
                    color: "primary",
                }}
            >
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
                            {pages?.map((page) => (
                                <tr className="table__body-row" key={page?.id}>
                                    <td className="table__body-item">
                                        {page?.name}
                                    </td>
                                    <td className="table__body-item">
                                        {page?.url}
                                        <Link
                                            href={`${SITE_URL}/other-pages/${page.url}`}
                                        >
                                            <a
                                                target="_blank"
                                                style={{ marginRight: 5 }}
                                                title="مشاهده صفحه"
                                            >
                                                <AiFillEye fontSize={16} />
                                            </a>
                                        </Link>
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
                                                    height={100}
                                                    width={300}
                                                    style={{
                                                        width: 90,
                                                        height: 30,
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

                            {pages.length === 0 && (
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

export default SitePages;
