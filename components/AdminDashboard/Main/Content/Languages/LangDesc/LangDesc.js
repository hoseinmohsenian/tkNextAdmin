import { useState } from "react";
import Link from "next/link";
import Box from "../../Elements/Box/Box";
import Modal from "../../../../../Modal/Modal";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

function LangDesc({ languages }) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    content: "محتوا",
                    lang: "زبان ها",
                    des: "توضیحات زبان",
                }}
            />

            <Box
                title="توضیحات زبان ها"
                buttonInfo={{
                    name: "لیست زبان ها",
                    url: "/content/language",
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
                        <h3 className={"modal__title"}>جزئیات توضیحات زبان</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    عنوان سئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedItem?.title_seo || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    کلید سئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedItem?.seo_key || "-"}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام زبان</th>
                                <th className="table__head-item">url</th>
                                <th className="table__head-item">h1</th>
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
                                        {lan?.url || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lan?.h1 || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/content/lang/des/${lan?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedItem(lan);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
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
