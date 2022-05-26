import { useState } from "react";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import { BASE_URL } from "../../../../../constants";
import { useGlobalContext } from "../../../../../context";

function NotHeldClasses(props) {
    const {
        fetchedClasses: { data, ...restData },
        token,
    } = props;
    const [classes, setClasses] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();
    moment.locale("fa", { useGregorianParser: true });
    const { formatTime } = useGlobalContext();

    const readClasses = async (page = 1) => {
        let searchParams = {};

        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/tkpanel/class/paymentForClassNotStatus`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/classroom/not-held?page=${page}`,
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
            setClasses(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading not held classes", error);
        }
    };

    return (
        <div>
            <Box title="لیست کلاس های برگزار نشده">
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام زبان آموز
                                </th>
                                <th className="table__head-item">موبایل</th>
                                <th className="table__head-item">
                                    اعتبار زبان آموز
                                </th>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">وضعیت کلاس</th>
                                <th className="table__head-item">
                                    وضعیت پرداخت
                                </th>
                                <th className="table__head-item">قیمت</th>
                                <th className="table__head-item">تاریخ کلاس</th>
                                <th className="table__head-item">زمان کلاس</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {classes?.map((cls, i) => (
                                <tr className="table__body-row" key={cls.id}>
                                    <td className="table__body-item">
                                        {cls.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.user_mobile}
                                    </td>
                                    <td className="table__body-item">
                                        {typeof cls.user_wallet === "number"
                                            ? `${Intl.NumberFormat().format(
                                                  cls.user_wallet
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {cls?.status === 1 ? "غیرفعال" : "فعال"}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.pay === 1
                                            ? "پرداخت شده"
                                            : "پرداخت نشده"}
                                    </td>
                                    <td className="table__body-item">
                                        {typeof cls.user_wallet === "number"
                                            ? `${Intl.NumberFormat().format(
                                                  cls.user_wallet
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment
                                            .from(cls.date, "en", "YYYY/MM/DD")
                                            .locale("fa")
                                            .format("YYYY/MM/DD")}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.time ? formatTime(cls.time) : "-"}
                                    </td>
                                </tr>
                            ))}

                            {classes.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={12}
                                    >
                                        کلاسی پیدا نشد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {classes.length !== 0 && (
                    <Pagination read={readClasses} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default NotHeldClasses;
