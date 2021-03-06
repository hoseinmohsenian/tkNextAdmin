import { useState } from "react";
import Box from "../../Elements/Box/Box";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import { BASE_URL } from "../../../../../../constants";
import Modal from "../../../../../Modal/Modal";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";

function StudentTransactionDetails(props) {
    const {
        fetchedTransactions: { data, ...restData },
        token,
    } = props;
    const [transactions, setTransactions] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState({});
    moment.locale("fa", { useGregorianParser: true });

    const readTransactions = async (page = 1) => {
        let searchParams = {};

        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/tkpanel/user/credits`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/accounting/student/transactions?page=${page}`,
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
            setTransactions(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading transactions", error);
        }
    };

    return (
        <div>
            <Box title="???????????? ???????????? ???????? ????????">
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>???????????? ??????????????</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ??????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTransaction.admin_name || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ??????????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTransaction?.desc}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ?????????? ????????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {moment
                                        .from(
                                            selectedTransaction.pay_time,
                                            "en",
                                            "YYYY/MM/DD hh:mm:ss"
                                        )
                                        .locale("fa")
                                        .format("YYYY/MM/DD hh:mm:ss")}
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
                                    ?????? ???????? ????????
                                </th>
                                <th className="table__head-item">
                                    ???????????? ???????? ????????
                                </th>
                                <th className="table__head-item">????????</th>
                                <th className="table__head-item">
                                    ???????????? ???????? ????????
                                </th>
                                <th className="table__head-item">?????? ????????????</th>
                                <th className="table__head-item">??????????????</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {transactions?.map((cls) => (
                                <tr className="table__body-row" key={cls.id}>
                                    <td className="table__body-item">
                                        {cls.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.user_mobile}
                                        {cls?.user_mobile && (
                                            <Link
                                                href={`https://api.whatsapp.com/send?phone=${cls.user_mobile}`}
                                            >
                                                <a
                                                    className="whatsapp-icon"
                                                    target="_blank"
                                                >
                                                    <span>
                                                        <AiOutlineWhatsApp />
                                                    </span>
                                                </a>
                                            </Link>
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        {Intl.NumberFormat().format(cls.amount)}{" "}
                                        ??????????
                                    </td>
                                    <td className="table__body-item">
                                        {Intl.NumberFormat().format(
                                            cls.user_wallet
                                        )}{" "}
                                        ??????????
                                    </td>
                                    <td className="table__body-item">
                                        {cls.status === 1
                                            ? "???????? ????????????"
                                            : "???????????? ????????????"}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedTransaction(cls);
                                                setOpenModal(true);
                                            }}
                                        >
                                            ????????????
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {transactions.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={12}
                                    >
                                        ?????????????? ???????? ??????.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {transactions.length !== 0 && (
                    <Pagination read={readTransactions} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default StudentTransactionDetails;
