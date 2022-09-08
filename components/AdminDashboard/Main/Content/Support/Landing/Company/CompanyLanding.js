import { useState } from "react";
import Link from "next/link";
import moment from "jalali-moment";
import Box from "../../../Elements/Box/Box";
import BreadCrumbs from "../../../Elements/Breadcrumbs/Breadcrumbs";
import Modal from "../../../../../../Modal/Modal";

function CompanyLanding({ landings }) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedLanding, setSelectedLanding] = useState({
        email: "",
        gender: 0,
    });
    moment.locale("fa", { useGregorianParser: true });

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    landing: "لندینگ",
                    company: "لندینگ شرکتی",
                }}
            />

            <Box
                title="لندینگ شرکتی"
                buttonInfo={{
                    name: "ایجاد لندینگ",
                    url: "/tkpanel/landing/company/create",
                    color: "primary",
                }}
            >
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات لندینگ</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    عنوان سئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedLanding?.seo_title || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    توصضیحات سئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedLanding?.seo_desc || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    کلید سئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedLanding?.seo_key || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    عنوان ویدئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedLanding?.video_title || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    عنوان faq
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedLanding?.faq_title || "-"}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">عنوان</th>
                                <th className="table__head-item">url</th>
                                <th className="table__head-item">تصویر</th>
                                <th className="table__head-item">
                                    تاریخ ایجاد
                                </th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {landings?.map((landing, i) => (
                                <tr
                                    className="table__body-row"
                                    key={landing.id}
                                >
                                    <td className="table__body-item">
                                        {landing.title}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {landing.url}
                                    </td>
                                    <td className="table__body-item">
                                        {landing.image ? (
                                            <img
                                                src={landing.image}
                                                alt="تصویر لندینگ"
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                }}
                                            />
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        {moment(landing?.created_at).format(
                                            "DD MMM YYYY"
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/landing/company/${landing?.id}/edit`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedLanding(landing);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {landings?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={4}
                                    >
                                        لندینگی برای نمایش وجود ندارد.
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

export default CompanyLanding;
