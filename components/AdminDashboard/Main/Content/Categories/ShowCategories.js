import { useState } from "react";
import cstyles from "./ShowCategories.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Box from "../Elements/Box/Box";
import Modal from "../../../../Modal/Modal";

function ShowCategories({ fetchedCategories, title, createPage, addressPage }) {
    const [categories] = useState(fetchedCategories);
    const { asPath } = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({});

    return (
        <div>
            <Box
                title={title}
                buttonInfo={{
                    name: "ایجاد دسته بندی",
                    url: createPage,
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
                                    header
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedCategory?.header || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    توضیحات کوتاه
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedCategory?.summary_desc || "-"}
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
                                <th className="table__head-item">تصویر</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {categories?.map((ctg) => (
                                <tr className="table__body-row" key={ctg?.id}>
                                    <td
                                        className={`table__body-item ${cstyles["table-item"]}`}
                                    >
                                        {ctg?.title}
                                    </td>
                                    <td
                                        className={`table__body-item ${cstyles["table-item"]}`}
                                    >
                                        <img
                                            src={ctg?.image}
                                            alt={ctg?.title}
                                            className={cstyles["category-img"]}
                                        />
                                        &nbsp; &nbsp;
                                    </td>
                                    <td
                                        className={`table__body-item ${cstyles["table-item"]}`}
                                    >
                                        <Link
                                            href={`${addressPage}/${ctg?.title}`}
                                        >
                                            <a className="action-btn primary">
                                                آدرس‌&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`${asPath}/${ctg?.id}/edit`}
                                        >
                                            <a className="action-btn warning">
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedCategory(ctg);
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

export default ShowCategories;
