import Link from "next/link";
import Box from "../Elements/Box/Box";
import moment from "jalali-moment";

function Discount({ discounts }) {
    return (
        <div>
            <Box
                title="لیست کوپن تخفیف"
                buttonInfo={{
                    name: "ایجاد کوپن",
                    url: "/tkpanel/copens/create",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">عنوان</th>
                                <th className="table__head-item">درصد تخفیف</th>
                                <th className="table__head-item">مبلغ تخفیف</th>
                                <th className="table__head-item">حداقل قیمت</th>
                                <th className="table__head-item">
                                    حداکثر قیمت
                                </th>
                                <th className="table__head-item">تعداد</th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">نوع</th>
                                <th className="table__head-item">تاریخ شروع</th>
                                <th className="table__head-item">
                                    تاریخ انقضا
                                </th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {discounts?.map((discount) => (
                                <tr
                                    className="table__body-row"
                                    key={discount?.id}
                                >
                                    <td className="table__body-item">
                                        {discount.name}
                                    </td>
                                    <td className="table__body-item">
                                        {discount?.percent
                                            ? `${discount?.percent}%`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {discount?.value
                                            ? `${Intl.NumberFormat().format(
                                                  discount?.value
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {discount?.min
                                            ? `${Intl.NumberFormat().format(
                                                  discount?.min
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {discount?.max
                                            ? `${Intl.NumberFormat().format(
                                                  discount?.max
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {discount?.number}
                                    </td>
                                    <td className="table__body-item">
                                        {discount?.active_status
                                            ? "فعال"
                                            : "غیرفعال"}
                                    </td>
                                    <td className="table__body-item">
                                        {discount?.type}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment(discount.start_at).format(
                                            "YYYY/MM/DD hh:mm:ss"
                                        )}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment(discount.expired_at).format(
                                            "YYYY/MM/DD hh:mm:ss"
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/copens/${discount.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {discounts.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={11}
                                    >
                                        کوپنی یافت نشد
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

export default Discount;
