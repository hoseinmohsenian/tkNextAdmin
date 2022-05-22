import { useState } from "react";
import Box from "../../Elements/Box/Box";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import { BASE_URL } from "../../../../../../constants";

function TeacherTransactionDetails(props) {
    const {
        fetchedTransactions: { data, ...restData },
        token,
    } = props;
    const [transactions, setTransactions] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();
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
            pathname: `/tkpanel/teacher/credits`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/accounting/teacher/transactions?page=${page}`,
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
            <Box title="جزئیات پرداختی برای استاد">
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">مبلغ</th>
                                <th className="table__head-item">توضیحات</th>
                                <th className="table__head-item">ادمین</th>
                                <th className="table__head-item">نوع تراکنش</th>
                                <th className="table__head-item">
                                    تاریخ پرداخت
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {transactions?.map((cls) => (
                                <tr className="table__body-row" key={cls.id}>
                                    <td className="table__body-item">
                                        {cls.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {Intl.NumberFormat().format(cls.amount)}{" "}
                                        تومان
                                    </td>
                                    <td className="table__body-item">
                                        {cls.desc}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.admin_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.status === 1
                                            ? "کاهش اعتبار"
                                            : "افزایش اعتبار"}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment
                                            .from(
                                                cls.pay_time,
                                                "en",
                                                "YYYY/MM/DD hh:mm:ss"
                                            )
                                            .locale("fa")
                                            .format("YYYY/MM/DD hh:mm:ss")}
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

export default TeacherTransactionDetails;
