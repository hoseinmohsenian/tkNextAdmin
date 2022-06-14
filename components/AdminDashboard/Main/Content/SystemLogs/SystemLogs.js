import { useState } from "react";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import { BASE_URL } from "../../../../../constants";
import { useRouter } from "next/router";
import Link from "next/link";
import Modal from "../../../../Modal/Modal";

function SystemLogs({ fetchedLogs: { data, ...restData }, token }) {
    const [logs, setLogs] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [openModal, setOpenModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState({});
    const router = useRouter();

    const readSystemLogs = async (page = 1) => {
        let searchParams = {};

        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/tkpanel/logReport/show`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/tracking-log?page=${page}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const {
                data: { data, ...restData },
            } = await res.json();
            setLogs(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading logs", error);
        }
    };

    return (
        <div>
            <Box
                title="لاگ سیستم"
                buttonInfo={{
                    name: "ایجاد لاگ",
                    url: "/tkpanel/logReport/show/create",
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
                        <h3 className={"modal__title"}>جزئیات لاگ سیستم</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    توضیحات
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedLog.desc || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    آیدی استاد
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedLog.teacher_id || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    آیدی زبان آموز
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedLog.user_id || "-"}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    ایجاد کننده
                                </th>
                                <th className="table__head-item">زبان آموز</th>
                                <th className="table__head-item">
                                    admin_assign
                                </th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {logs?.map((lg) => (
                                <tr className="table__body-row" key={lg?.id}>
                                    <td className="table__body-item">
                                        {lg.creator_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lg.user_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lg.admin_assign_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {lg.status_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/logReport/show/${lg?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/logReport/show/${lg?.id}/children`}
                                        >
                                            <a className={`action-btn primary`}>
                                                لاگ فرزند
                                            </a>
                                        </Link>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedLog(lg);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {logs.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={8}
                                    >
                                        لاگی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {logs.length !== 0 && (
                    <Pagination read={readSystemLogs} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default SystemLogs;
