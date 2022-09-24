import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Box from "../../Elements/Box/Box";
import Modal from "../../../../../Modal/Modal";
import Alert from "../../../../../Alert/Alert";

function SitePagesContent({ list, token, parent }) {
    const router = useRouter();
    const { page_id } = router.query;
    const [openModal, setOpenModal] = useState(false);
    const [contents, setContents] = useState(list);
    const [selectedItem, setSelectedItem] = useState({});
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(Array(list?.length).fill(false));
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const updateNewList = (content_id) => {
        setContents(contents.filter((item) => item.id !== content_id));
    };

    const deleteList = async (content_id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/site-page/list/${content_id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(true, "danger", "این محتوا حذف شد");
                updateNewList(content_id);
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message
                );
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting page list", error);
        }
    };

    return (
        <div>
            <Box
                title={`محتوای صفحه «${parent.name}»`}
                buttonInfo={{
                    name: "محتوای جدید",
                    url: `/tkpanel/pages/${page_id}/content/create`,
                    color: "primary",
                }}
            >
                {/* Alert */}
                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={deleteList}
                />

                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات محتوا</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    عنوان سئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedItem.title_seo || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    توضیحات سئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedItem.seo_desc || "-"}
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
                                <th className="table__head-item">
                                    توضیحات کوتاه
                                </th>
                                <th className="table__head-item">تصویر</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {contents?.map((item, i) => (
                                <tr className="table__body-row" key={item?.id}>
                                    <td className="table__body-item">
                                        {item.title}
                                    </td>
                                    <td className="table__body-item">
                                        {item.sum_desc || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <div
                                            className="table__body-link"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            {item.image ? (
                                                <img
                                                    src={item?.image}
                                                    alt={item?.name}
                                                    height={40}
                                                    width={40}
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: "50%",
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
                                            href={`/tkpanel/pages/${item.site_page_id}/content/${item.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() =>
                                                deleteList(item?.id, i)
                                            }
                                            disabled={loadings[i]}
                                        >
                                            حذف
                                        </button>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {contents.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={4}
                                    >
                                        محتوایی وجود ندارد!
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

export default SitePagesContent;
