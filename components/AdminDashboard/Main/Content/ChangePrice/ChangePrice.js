import { useState } from "react";
import styles from "./ChangePrice.module.css";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import Pagination from "../Pagination/Pagination";
import moment from "jalali-moment";
import Box from "../Elements/Box/Box";
import {useRouter} from "next/router"
import {useGlobalContext} from "../../../../../context"

function ChangePrice(props) {
    const {
        fetchedPrices: { data, ...restData },
        token,
    } = props;
    const [prices, setPrices] = useState(data);
    const [filters, setFilters] = useState({
        user_name:"",   
        teacher_name:"",
        teacher_mobile:"",
        user_mobile:"",
    });
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

    const readList = async (page = 1) => {
        setLoading(true);

        let searchQuery = "";
        Object.keys(filters).forEach((key) => {
            if(Boolean(filters[key])){
                searchQuery += `${key}=${filters[key]}&`;
            }
        });
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

    const changePrice = async (e, price_id, i) => {
        try {

            const res = await fetch(
                `${BASE_URL}/admin/classroom/change-price/${price_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ price: e.target.value }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = `قیمت به ${e.target.value} تومان تغییر کرد`;
                showAlert(true, "success", message);
            }
        } catch (error) {
            console.log("Error changing price", error);
        }
    };

    const changePriceHandler = async (e, price_id, i) => {
        if (
            Number(e.target.value) !== prices[i]?.price &&
            e.target.value
        ) {
            await changePrice(e, price_id, i);
            let temp = [...prices];
            temp[i]?.price = Number(e.target.value);
            setPrices(() => temp);
        }
    };

    return (
        <div>
            <Box title="لیست تغییر قیمت کلاس">
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
                                    شماره استاد
                                </th>
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
                                    </td>
                                    <td className="table__body-item">
                                        {price?.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {price?.teacher_mobile || "-"}
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
                                                type="number"
                                                name="price"
                                                id="price"
                                                className="form__input"
                                                onChange={(e) =>
                                                    priceOnChange(
                                                        e,
                                                        i,
                                                    )
                                                }
                                                value={prices[i]?.price || ""}
                                                onBlur={(e) =>
                                                    changePriceHandler(
                                                        e,
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
