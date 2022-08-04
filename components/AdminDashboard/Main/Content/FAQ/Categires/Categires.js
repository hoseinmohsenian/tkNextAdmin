import { useState } from "react";
import Link from "next/link";
import Box from "../../Elements/Box/Box";
import Modal from "../../../../../Modal/Modal";

function Categories({ categories }) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});

    console.log(categories);

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
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات دسته بندی</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    meta title
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedItem?.meta_title || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    meta key
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedItem?.meta_key || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    meta desc
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedItem?.meta_desc || "-"}
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
                                <th className="table__head-item">URL</th>
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
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedItem(catg);
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

export default Categories;
