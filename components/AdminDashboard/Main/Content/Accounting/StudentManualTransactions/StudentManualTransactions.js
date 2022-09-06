import { useState } from "react";
import Box from "../../Elements/Box/Box";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import { BASE_URL } from "../../../../../../constants";
import { ExportCSV } from "../../../../../exportToCSV/exportToCSV";
import Modal from "../../../../../Modal/Modal";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";
import styles from "./StudentManualTransactions.module.css";

const filtersSchema = { user_name: "", user_mobile: "" };
const appliedFiltersSchema = { user_name: false, user_mobile: false };

function StudentManualTransactions(props) {
    const {
        fetchedTransactions: { data, ...restData },
        token,
        searchData,
    } = props;
    const [transactions, setTransactions] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState({});
    const [filters, setFilters] = useState(searchData);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [loading, setLoading] = useState(false);
    moment.locale("fa", { useGregorianParser: true });

    const readTransactions = async (page = 1, avoidFilters = false) => {
        let searchParams = {};

        const isFilterEnabled = (key) =>
            Number(filters[key]) !== 0 &&
            filters[key] !== undefined &&
            filters[key];

        // Constructing search parameters
        let searchQuery = "";
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };

            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    searchQuery += `${key}=${filters[key]}&`;
                    tempFilters[key] = true;
                    searchParams = { ...searchParams, [key]: filters[key] };
                } else {
                    tempFilters[key] = false;
                }
            });

            setAppliedFilters(tempFilters);
        }
        searchQuery += `page=${page}`;

        router.push({
            pathname: `/tkpanel/logUser/profile/accountingCredite`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/accounting/student/manual/transactions?${searchQuery}`,
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

    const filtersOnChangeHandler = (e) => {
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
            pathname: `/tkpanel/logUser/profile/accountingCredite`,
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
                    logUser: "حسابداری",
                    profile: "زبان آموز",
                    accountingCredite: "لیست افزایش اعتبار دستی",
                }}
            />

            <Box title="لیست افزایش اعتبار دستی">
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات افزایش اعتبار</h3>
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
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    تصویر
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTransaction.image ? (
                                        <img
                                            src={selectedTransaction.image}
                                            alt="تصویر"
                                            style={{ width: 150, height: 150 }}
                                        />
                                    ) : (
                                        "-"
                                    )}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    تصویر کاربر
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTransaction.user_image ? (
                                        <img
                                            src={selectedTransaction.user_image}
                                            alt="تصویر کاربر"
                                            style={{ width: 60, height: 60 }}
                                        />
                                    ) : (
                                        "-"
                                    )}
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
                                        htmlFor="user_name"
                                        className={`form__label`}
                                    >
                                        نام زبان آموز :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="text"
                                            name="user_name"
                                            id="user_name"
                                            className="form__input"
                                            onChange={filtersOnChangeHandler}
                                            value={filters?.user_name}
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
                                        htmlFor="user_mobile"
                                        className={`form__label`}
                                    >
                                        موبایل زبان آموز :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="number"
                                            name="user_mobile"
                                            id="user_mobile"
                                            className="form__input"
                                            onChange={filtersOnChangeHandler}
                                            value={filters?.user_mobile}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles["btn-wrapper"]}>
                            <button
                                type="submit"
                                className={`btn primary ${styles["btn"]}`}
                                disabled={loading}
                            >
                                {loading ? "در حال انجام ..." : "اعمال فیلتر"}
                            </button>
                            {showFilters() && (
                                <button
                                    type="button"
                                    className={`btn danger-outline ${styles["btn"]}`}
                                    disabled={loading}
                                    onClick={() => removeFilters()}
                                >
                                    {loading ? "در حال انجام ..." : "حذف فیلتر"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

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
                                        {cls?.mobile && (
                                            <Link
                                                href={`https://api.whatsapp.com/send?phone=${cls.mobile}`}
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
