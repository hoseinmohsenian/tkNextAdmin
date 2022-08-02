import { useState } from "react";
import styles from "./ChangePrice.module.css";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import Pagination from "../Pagination/Pagination";
import moment from "jalali-moment";
import Box from "../Elements/Box/Box";
import { useRouter } from "next/router";
import { useGlobalContext } from "../../../../../context";
import { AiOutlineWhatsApp,AiOutlineInfoCircle } from "react-icons/ai";
import Link from "next/link";
import ReactTooltip from "react-tooltip";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

const filtersSchema = { user_name: "", teacher_name: "", teacher_mobile: "", user_mobile: "", };
const appliedFiltersSchema = { 
    user_name: false,
    teacher_name: false,
    teacher_mobile: false,
    user_mobile: false
};

function ChangePrice(props) {
    const {
        fetchedPrices: { data, ...restData },
        token,
    } = props;
    const [prices, setPrices] = useState(data);
    const [filters, setFilters] = useState(filtersSchema);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    moment.locale("fa", { useGregorianParser: true });
    const { formatTime } = useGlobalContext()

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    const priceOnChange = (e, rowInd) => {
        let updated = [...prices];
        updated[rowInd] = { ...updated[rowInd], price: e.target.value };
        setPrices(() => updated);
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const readList = async (page = 1, avoidFilters = false) => {
        setLoading(true);

        let searchQuery = "";
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };

            Object.keys(filters).forEach((key) => {
                if(Boolean(filters[key])){
                    searchQuery += `${key}=${filters[key]}&`;
                    tempFilters[key] = true;
                }
                else{
                    tempFilters[key] = false;
                }
            });

            setAppliedFilters(tempFilters);
        }
        searchQuery += `page=${page}`;

        let searchParams = {};
        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }
        router.push({
            pathname: `/tkpanel/requestDetails/changePrice`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/classroom/change-price?${searchQuery}`,
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
            setPrices(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false);
        } catch (error) {
            console.log("Error reading prices", error);
        }
    };

    const changePrice = async (value, price_id, i) => {
        try {

            const res = await fetch(
                `${BASE_URL}/admin/classroom/change-price/${price_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ price: Number(value) }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = `قیمت به ${Intl.NumberFormat().format(Number(value))} تومان تغییر کرد`;
                showAlert(true, "success", message);
            }
            else{
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message
                );
            }
        } catch (error) {
            console.log("Error changing price", error);
        }
    };

    const changePriceHandler = async (value, price_id, i) => {
        if (Number(value) !== prices[i]?.price && value) {
            await changePrice(value, price_id, i);
            let temp = [...prices];
            temp[i]?.price = value;
            setPrices(() => temp);
            console.log(value);
        }
    };

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);        
        readList(1, true);
        router.push({
            pathname: `/tkpanel/requestDetails/changePrice`,
            query: {},
        });
    };

    const showFilters = () => {
        let values = Object.values(appliedFilters);
        for (let i = 0; i < values.length; i++) {
            let value = values[i];
            if (value) {
                return false;
            }
        }
        return true;
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    requestDetails: "کلاس",
                    changePrice: "لیست تغییر قیمت کلاس"
                }}
            />

            <Box title="لیست تغییر قیمت کلاس">
                <ReactTooltip className="tooltip" />

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
                                onClick={() => readList()}
                            >
                                {loading ? "در حال انجام ..." : "اعمال فیلتر"}
                            </button>
                            {!showFilters() && (
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
                    </form>
                </div>

                {/* Alert */}
                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={changePriceHandler}
                />

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام زبان آموز
                                </th>
                                <th className="table__head-item">
                                    شماره زبان آموز
                                </th>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">
                                    اعتبار زبان آموز
                                </th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">قیمت</th>
                                <th className="table__head-item">زمان</th>
                                <th className="table__head-item">تاریخ</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {prices?.map((price, i) => (
                                <tr className="table__body-row" key={price?.id}>
                                    <td className="table__body-item">
                                        {price?.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        {price?.user_mobile || "-"}
                                        {price?.user_mobile && (
                                                <Link
                                                    href={`https://api.whatsapp.com/send?phone=98${price.user_mobile?.slice(1)}`}
                                                >
                                                    <a className="whatsapp-icon" target="_blank">
                                                        <span>
                                                            <AiOutlineWhatsApp />
                                                        </span>
                                                    </a>
                                                </Link>
                                            )}
                                    </td>
                                    <td className="table__body-item" data-tip={price?.teacher_mobile || "-"}>
                                        {price?.teacher_name}
                                        <span className="info-icon">
                                            <AiOutlineInfoCircle />
                                        </span>
                                    </td>
                                    <td className="table__body-item">
                                        {`${Intl.NumberFormat().format(price?.user_wallet)} تومان`}
                                    </td>
                                    <td className="table__body-item">
                                        {price?.status === 1 ? "برگزار نشده" : "برگزار شده"}
                                    </td>
                                    <td className="table__body-item">
                                        <div className="form-control" style={{width:"60px",margin:0}}>
                                            <input
                                                type="text"
                                                name="price"
                                                id="price"
                                                className="form__input form__input--ltr"
                                                onChange={(e) =>
                                                    priceOnChange(
                                                        e,
                                                        i,
                                                    )
                                                }
                                                value={
                                                    typeof prices[i]?.price === "number" ?
                                                    Intl.NumberFormat().format(prices[i]?.price) : 
                                                    Intl.NumberFormat().format(prices[i]?.price.replace(/,/g, "")) 
                                                        || ""
                                                }
                                                onBlur={(e) =>
                                                    changePriceHandler(
                                                        e.target.value.replace(/,/g, ""),
                                                        price.id,
                                                        i
                                                    )
                                                }
                                                autoComplete="off"
                                            />
                                        </div>
                                    </td>
                                    <td className="table__body-item">
                                        {price.time ? 
                                            formatTime(price.time)                                
                                        : "-"}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {price.date ? moment(price.date).format(
                                            "YYYY/MM/DD"
                                        ) : "-"}
                                    </td>
                                </tr>
                            ))}

                            {prices?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={10}
                                    >
                                        درخواست تغییر قیمتی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {prices.length !== 0 && (
                    <Pagination read={readList} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default ChangePrice;
