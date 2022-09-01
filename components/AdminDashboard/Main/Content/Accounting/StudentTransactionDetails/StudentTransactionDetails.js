import { useState } from "react";
import Box from "../../Elements/Box/Box";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import { BASE_URL } from "../../../../../../constants";
import Modal from "../../../../../Modal/Modal";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";
import styles from "./StudentTransactionDetails.module.css";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

const filtersSchema = { tracking_code: "" };
const appliedFiltersSchema = { tracking_code: false };

function StudentTransactionDetails(props) {
    const {
        fetchedTransactions: { data, ...restData },
        token,
        searchData,
    } = props;
    const [transactions, setTransactions] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [filters, setFilters] = useState({ ...filtersSchema, ...searchData });
    const [appliedFilters, setAppliedFilters] = useState({
        ...appliedFiltersSchema,
        ...searchData,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState({});
    moment.locale("fa", { useGregorianParser: true });

    const readTransactions = async (page = 1, avoidFilters = false) => {
        setLoading(true);

        // Constructing search parameters
        let searchParams = {};
        let searchQuery = "";
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };

            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    searchQuery += `${key}=${filters[key]}&`;
                    tempFilters[key] = true;
                    searchParams = {
                        ...searchParams,
                        [key]: filters[key],
                    };
                } else {
                    tempFilters[key] = false;
                }
            });

            setAppliedFilters(tempFilters);
        }

        searchQuery += `page=${page}`;

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
                `${BASE_URL}/admin/accounting/student/transactions?${searchQuery}`,
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
        setLoading(false);
    };

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);
        readTransactions(1, true);
        router.push({
            pathname: `/tkpanel/user/credits`,
            query: {},
        });
    };

    const showFilters = () => {
        let values = Object.values(appliedFilters);
        for (let i = 0; i < values.length; i++) {
            let value = values[i];
            if (value) {
                return true;
            }
        }
        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await readTransactions();
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    user: "حسابداری",
                    credits: "جزئیات پرداخت زبان آموز",
                }}
            />

            <Box title="جزئیات پرداخت زبان آموز">
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
                                    کد پیگیری
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTransaction.tracking_code || "-"}
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

                <div className={styles["search"]}>
                    <form
                        className={styles["search-wrapper"]}
                        onSubmit={handleSubmit}
                    >
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="tracking_code"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        کد پیگیری :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="text"
                                            name="tracking_code"
                                            id="tracking_code"
                                            className="form__input form__input--ltr"
                                            onChange={handleOnChange}
                                            value={filters.tracking_code}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className={styles["btn-wrapper"]}>
                                    <button
                                        type="submit"
                                        className={`btn primary ${styles["btn"]}`}
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "در حال انجام ..."
                                            : "اعمال فیلتر"}
                                    </button>
                                    {showFilters() && (
                                        <button
                                            type="button"
                                            className={`btn danger-outline ${styles["btn"]}`}
                                            disabled={loading}
                                            onClick={() => removeFilters()}
                                        >
                                            {loading
                                                ? "در حال انجام ..."
                                                : "حذف فیلتر"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

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
                                <th className="table__head-item">
                                    اعتبار زبان آموز
                                </th>
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
                                        تومان
                                    </td>
                                    <td className="table__body-item">
                                        {Intl.NumberFormat().format(
                                            cls.user_wallet
                                        )}{" "}
                                        تومان
                                    </td>
                                    <td className="table__body-item">
                                        {cls.status === 1 ? (
                                            <span className="danger-color">
                                                کاهش اعتبار
                                            </span>
                                        ) : (
                                            <span className="success-color">
                                                افزایش اعتبار
                                            </span>
                                        )}
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

export default StudentTransactionDetails;
