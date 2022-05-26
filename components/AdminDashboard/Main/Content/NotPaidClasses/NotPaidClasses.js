import { useState } from "react";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import { useGlobalContext } from "../../../../../context/index";

function NotPaidClasses(props) {
    const {
        fetchedClasses: { data, ...restData },
        token,
    } = props;
    const [classes, setClasses] = useState(data);
    const [formData, setFormData] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
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
            pathname: `/tkpanel/class/notPaymentForClass`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/classroom/not-payed?page=${page}`,
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
            console.log("Error reading not payed classes", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const loadingHandler = (ind, value) => {
        let temp = [...loadings];
        temp[ind] = value;
        setLoadings(() => temp);
    };

    const handleOnChange = (e, rowInd, name) => {
        let updated = [...formData];
        updated[rowInd] = { ...updated[rowInd], [name]: e.target.value };
        setFormData(() => updated);
    };

    const changePriceHandler = async (e, class_id, i) => {
        if (
            Number(e.target.value) !== classes[i]?.price &&
            e.target.value
        ) {
            await changePrice(e, class_id, i);
            let temp = [...classes];
            temp[i]?.price = Number(e.target.value);
            setClasses(() => temp);
        }
    };

    const changePrice = async (e, class_id, i) => {
        try {
            loadingHandler(i, true);

            const res = await fetch(
                `${BASE_URL}/admin/classroom/change-price/${class_id}`,
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

            loadingHandler(i, false);
        } catch (error) {
            console.log("Error changing price", error);
        }
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={changePriceHandler}
            />

            <Box title="لیست کلاس های پرداخت نشده">
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
                                <th className="table__head-item">
                                    وضعیت استاد
                                </th>
                                <th className="table__head-item">
                                    وضعیت پرداخت
                                </th>
                                <th className="table__head-item">قیمت</th>
                                <th className="table__head-item">تاریخ کلاس</th>
                                <th className="table__head-item">زمان کلاس</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {classes?.map((item, i) => (
                                <tr className="table__body-row" key={item.id}>
                                    <td className="table__body-item">
                                        {item.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        {item.user_mobile}
                                    </td>
                                    <td className="table__body-item">
                                        {typeof item.user_wallet === "number"
                                            ? `${Intl.NumberFormat().format(
                                                  item.user_wallet
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.status === 1
                                                ? "غیرفعال"
                                                : "فعال"}
                                    </td>
                                    <td className="table__body-item">
                                        {item.pay === 1
                                            ? "پرداخت شده"
                                            : "پرداخت نشده"}
                                    </td>
                                    <td className="table__body-item">
                                    <div className="form-control" style={{width:"100px",margin:0}}>
                                            <input
                                                type="number"
                                                name="price"
                                                id="price"
                                                className="form__input form__input--ltr"
                                                onChange={(e) =>
                                                    handleOnChange(
                                                        e,
                                                        i,
                                                        "price"
                                                    )
                                                }
                                                value={formData[i]?.price || ""}
                                                onBlur={(e) =>
                                                    changePriceHandler(
                                                        e,
                                                        item?.id,
                                                        i
                                                    )
                                                }
                                                disabled={loadings[i]}
                                                autoComplete="off"
                                                spellCheck={false}
                                            />
                                            تومان
                                        </div>
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment
                                            .from(
                                                item.date,
                                                "en",
                                                "YYYY/MM/DD"
                                            )
                                            .locale("fa")
                                            .format("YYYY/MM/DD")}
                                    </td>
                                    <td className="table__body-item">
                                        {item.time ? formatTime(item.time) : "-"}
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

export default NotPaidClasses;
