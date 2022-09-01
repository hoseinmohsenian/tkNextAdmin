import { useState } from "react";
import Link from "next/link";
import Box from "../Elements/Box/Box";
import moment from "jalali-moment";
import Modal from "../../../../Modal/Modal";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

function Discount({ discounts }) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState({});

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    copens: "کوپن تخفیف",
                }}
            />
            <Box
                title="لیست کوپن تخفیف"
                buttonInfo={{
                    name: "ایجاد کوپن",
                    url: "/tkpanel/copens/create",
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
                        <h3 className={"modal__title"}>جزئیات کوپن تخفیف</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    وضعیت
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedDiscount?.active_status
                                        ? "فعال"
                                        : "غیرفعال"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>نوع</span>
                                <span className={"modal__item-body"}>
                                    {selectedDiscount.type === 0 && "همه"}
                                    {selectedDiscount.type === 1 &&
                                        "جلسه آزمایشی"}
                                    {selectedDiscount.type === 2 &&
                                        "کلاس خصوصی"}
                                    {selectedDiscount.type === 3 && "۵ جلسه"}
                                    {selectedDiscount.type === 4 && "۱۰ جلسه"}
                                    {selectedDiscount.type === 5 && "۱۶ جلسه"}
                                    {selectedDiscount.type === 6 &&
                                        "اولین خرید"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    تاریخ شروع
                                </span>
                                <span className={"modal__item-body"}>
                                    {moment(selectedDiscount.start_at).format(
                                        "YYYY/MM/DD hh:mm:ss"
                                    )}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    تاریخ انقضا
                                </span>
                                <span className={"modal__item-body"}>
                                    {moment(selectedDiscount.expired_at).format(
                                        "YYYY/MM/DD hh:mm:ss"
                                    )}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">کد تخفیف</th>
                                <th className="table__head-item">مبلغ تخفیف</th>
                                <th className="table__head-item">حداقل قیمت</th>
                                <th className="table__head-item">درصد تخفیف</th>
                                <th className="table__head-item">
                                    حداکثر قیمت
                                </th>
                                <th className="table__head-item">تعداد</th>
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
                                        {discount?.percent
                                            ? `${discount?.percent}%`
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
                                        <Link
                                            href={`/tkpanel/copens/${discount.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedDiscount(discount);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
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
