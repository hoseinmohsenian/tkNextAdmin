import { useState } from "react";
import Box from "../../Elements/Box/Box";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import { BASE_URL } from "../../../../../../constants";
import { ExportCSV } from "../../../../../exportToCSV/exportToCSV";
import Modal from "../../../../../Modal/Modal";

function StudentManualTransactions(props) {
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
            pathname: `/tkpanel/logUser/profile/accountingCredite`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/accounting/student/manual/transactions?page=${page}`,
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
            <Box title="لیست افزایش اعتبار دستی">
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات کلاس‌‌</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ادمین
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTransaction.admin_name || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    توضیحات
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTransaction?.desc}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    تاریخ پرداخت
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

                {transactions.length !== 0 && (
                    <ExportCSV
                        data={transactions.map((transaction) => {
                            return {
                                user_name: transaction.user_name,
                                mobile: transaction.mobile,
                                amount: transaction.amount,
                            };
                        })}
                        fileName={"Tikkaa__accountingCredite"}
                        fileExtension="xlsx"
                    />
                )}

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام زبان آموز
                                </th>
                                <th className="table__head-item">
                                    موبایل زبان آموز
                                </th>
                                <th className="table__head-item">مبلغ</th>
                                <th className="table__head-item">نوع تراکنش</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {transactions?.map((cls) => (
                                <tr className="table__body-row" key={cls.id}>
                                    <td className="table__body-item">
                                        {cls.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.mobile}
                                    </td>
                                    <td className="table__body-item">
                                        {Intl.NumberFormat().format(cls.amount)}{" "}
                                        تومان
                                    </td>
                                    <td className="table__body-item">
                                        {cls.status === 1
                                            ? "کاهش اعتبار"
                                            : "افزایش اعتبار"}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedTransaction(cls);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
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
                                        پرداختی پیدا نشد.
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

export default StudentManualTransactions;
