import { useState } from "react";
import Link from "next/link";
import Box from "../../Elements/Box/Box";
import moment from "jalali-moment";
import Pagination from "../../Pagination/Pagination";
import styles from "./UsedCoupons.module.css";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants/index";
import Modal from "../../../../../Modal/Modal";

function UsedCoupons({ fetchedCopens: { data, ...restData }, token }) {
    const [copens, setCoupons] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [filters, setFilters] = useState({
        user_name: "",
        teacher_name: "",
        teacher_mobile: "",
        user_mobile: "",
    });
    const [openModal, setOpenModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const readCoupons = async (page = 1) => {
        // Constructing search parameters
        let searchQuery = "";
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                searchQuery += `${key}=${filters[key]}&`;
            }
        });
        searchQuery += `page=${page}`;

        router.push({
            pathname: `/tkpanel/useCopen`,
            query: { page },
        });

        try {
            setLoading(true);
            const res = await fetch(
                `${BASE_URL}/admin/discount/used/all?${searchQuery}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const {
                data: { data, ...restData },
            } = await res.json();
            setCoupons(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false);
        } catch (error) {
            console.log("Error reading used coupons", error);
        }
    };

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    return (
        <div>
            <Box title="لیست کدهای تخفیف استفاده شده">
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
                                    زبان آموز
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedDiscount?.user?.name_family}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    موبایل زبان آموز
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedDiscount?.user?.mobile}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    استاد
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedDiscount?.teacher?.name}{" "}
                                    {selectedDiscount?.teacher?.family}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    موبایل استاد
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedDiscount?.teacher?.mobile}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    وضعیت
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedDiscount?.discount?.active_status
                                        ? "فعال"
                                        : "غیرفعال"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>نوع</span>
                                <span className={"modal__item-body"}>
                                    {selectedDiscount?.discount?.type || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    تاریخ شروع
                                </span>
                                <span className={"modal__item-body"}>
                                    {moment(
                                        selectedDiscount?.discount?.start_at
                                    ).format("YYYY/MM/DD hh:mm:ss")}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    تاریخ انقضا
                                </span>
                                <span className={"modal__item-body"}>
                                    {moment(
                                        selectedDiscount?.discount?.expired_at
                                    ).format("YYYY/MM/DD hh:mm:ss")}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="user_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        نام زبان آموز :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="user_name"
                                            id="user_name"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.user_name}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="user_mobile"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        شماره زبان آموز :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="tel"
                                            name="user_mobile"
                                            id="user_mobile"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.user_mobile}
                                            maxLength={11}
                                            pattern="\d*"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="teacher_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        نام استاد :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="teacher_name"
                                            id="teacher_name"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.teacher_name}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="teacher_mobile"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        شماره استاد :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="tel"
                                            name="teacher_mobile"
                                            id="teacher_mobile"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.teacher_mobile}
                                            maxLength={11}
                                            pattern="\d*"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles["btn-wrapper"]}>
                            <button
                                type="button"
                                className={`btn primary ${styles["btn"]}`}
                                disabled={loading}
                                onClick={() => readCoupons()}
                            >
                                {loading ? "در حال انجام ..." : "اعمال فیلتر"}
                            </button>
                        </div>
                    </form>
                </div>

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
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {copens?.map((copen) => (
                                <tr className="table__body-row" key={copen?.id}>
                                    <td className="table__body-item">
                                        {copen?.discount?.name}
                                    </td>
                                    <td className="table__body-item">
                                        {copen?.discount?.percent
                                            ? `${copen.discount.percent}%`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {copen?.discount?.value
                                            ? `${Intl.NumberFormat().format(
                                                  copen.discount.value
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {copen?.discount?.min
                                            ? `${Intl.NumberFormat().format(
                                                  copen.discount.min
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {copen?.discount?.max
                                            ? `${Intl.NumberFormat().format(
                                                  copen.discount.max
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {copen?.discount?.number || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/copens/${copen.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedDiscount(copen);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {copens.length === 0 && (
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

                {copens.length !== 0 && (
                    <Pagination read={readCoupons} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default UsedCoupons;
