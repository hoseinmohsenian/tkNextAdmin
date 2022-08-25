import { useState } from "react";
import Box from "../../Elements/Box/Box";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants";
import { ExportCSV } from "../../../../../exportToCSV/exportToCSV";
import Alert from "../../../../../Alert/Alert";
import { BsCheckLg } from "react-icons/bs";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

function TeacherWithdrawalRequests(props) {
    const {
        fetchedRequests: { data, ...restData },
        token,
    } = props;
    const [requests, setRequests] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const loadingsHandler = (i, state) => {
        let temp = [...loadings];
        temp[i] = state;
        setLoadings(() => temp);
    };

    const readRequests = async (page = 1) => {
        let searchParams = {};

        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/tkpanel/transactions/list`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/accounting/withdrawal?page=${page}`,
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
            setRequests(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading requests", error);
        }
    };

    const verifyAccount = async (request_id, admin_verified, i) => {
        loadingsHandler(i, true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/accounting/verify/account/${request_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        admin_verified: admin_verified === 0 ? 1 : 0,
                    }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = `شماره شبا ${
                    admin_verified === 0 ? "تایید" : "غیرتایید"
                } شد`;
                showAlert(
                    true,
                    admin_verified === 0 ? "success" : "warning",
                    message
                );
                let updated = [...requests];
                updated[i] = {
                    ...updated[i],
                    account: { admin_verified: admin_verified === 0 ? 1 : 0 },
                };
                setRequests(() => updated);
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            loadingsHandler(i, false);
        } catch (error) {
            console.log("Error verifying account!", error);
        }
    };

    const acceptWithdrawal = async (request_id, i) => {
        loadingsHandler(i, true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/accounting/accept/withdrawal/${request_id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = "برداشت تایید شد";
                showAlert(true, "success", message);
                // let updated = [...requests];
                // updated[i] = {
                //     ...updated[i],
                //     account: { admin_verified: admin_verified === 0 ? 1 : 0 },
                // };
                // setRequests(() => updated);
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            loadingsHandler(i, false);
        } catch (error) {
            console.log("Error accepting withdrawal!", error);
        }
    };

    const handleOnChange = (value, i) => {
        let updated = [...requests];
        updated[i] = {
            ...updated[i],
            selected: value,
        };
        setRequests(() => updated);
    };

    const handleAcceptWithdrawal = () => {
        requests.map(async (request, i) => {
            if (request.selected) {
                await acceptWithdrawal(request.id, i);
            }
        });
    };

    const changeSheba = async (e, request_id, i) => {
        try {
            let temp = [...loadings];
            temp[i] = true;
            setLoadings(() => temp);

            const res = await fetch(
                `${BASE_URL}/admin/accounting/edit/account/${request_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ sheba: e.target.value }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = `شماره شبا ویرایش شد`;
                showAlert(true, "success", message);
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }

            temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error changing sheba", error);
        }
    };

    const changeShebaHandler = async (e, request_id, i) => {
        if (
            // e.target.value !== requests[i]?.account?.sheba_number &&
            e.target.value
        ) {
            await changeSheba(e, request_id, i);
            let temp = [...requests];
            temp[i]?.account?.sheba_number = e.target.value;
            setRequests(() => temp);
        }
    };

    const handleInputOnChange = (e, rowInd) => {
        let updated = [...requests];
        updated[rowInd] = { 
            ...updated[rowInd], 
            account: { 
                ...updated[rowInd].account, 
                sheba_number: e.target.value 
            } 
        };
        setRequests(() => updated);
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={verifyAccount}
            />

            <BreadCrumbs
                substituteObj={{
                    transactions: "حسابداری",
                    list: "درخواست تسویه اساتید",
                }}
            />

            <Box title="لیست درخواست تسویه اساتید">
                {requests.length !== 0 && (
                    <ExportCSV
                        data={requests
                            .filter((request) => request.selected)
                            .map((request) => {
                                return {
                                    teacher_id: request.teacher_id,
                                    teacher_name: request.teacher_name,
                                    amount: request.amount,
                                };
                            })}
                        fileName={"Tikkaa__TeacherCheckoutTaxDocument"}
                        fileExtension="xlsx"
                        onClick={handleAcceptWithdrawal}
                        downloadOnEmpty={false}
                        errorOnEmpry="حداقل یک مورد انتخاب کنید"
                    />
                )}

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">مبلغ</th>
                                <th className="table__head-item">شماره کارت</th>
                                <th className="table__head-item">شماره شبا</th>
                                <th className="table__head-item">نام</th>
                                <th className="table__head-item">نام بانک</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {requests?.map((request, i) => (
                                <tr
                                    className="table__body-row"
                                    key={request.id}
                                >
                                    <td className="table__body-item">
                                        <div className="input-radio-wrapper">
                                            <input
                                                type="checkbox"
                                                id={request.id}
                                                name="selected"
                                                value="age0"
                                                onChange={(e) =>
                                                    handleOnChange(
                                                        e.target.checked,
                                                        i
                                                    )
                                                }
                                                checked={
                                                    requests[i].selected ||
                                                    false
                                                }
                                            />
                                            &nbsp;
                                            <label
                                                htmlFor={request.id}
                                                className="radio-title"
                                            >
                                                {request.teacher_name}
                                            </label>
                                        </div>
                                    </td>
                                    <td className="table__body-item">
                                        {Intl.NumberFormat().format(
                                            request.amount
                                        )}{" "}
                                        تومان
                                    </td>
                                    <td className="table__body-item">
                                        {request.account?.card_number}
                                    </td>
                                    <td className="table__body-item">
                                        <div className="form-control" style={{width:"220px",margin:0}}>
                                            <input
                                                type="text"
                                                name="commission"
                                                id="commission"
                                                className="form__input"
                                                onChange={(e) =>
                                                    handleInputOnChange(
                                                        e,
                                                        i
                                                    )
                                                }
                                                value={requests[i]?.account?.sheba_number || ""}
                                                onBlur={(e) =>
                                                    changeShebaHandler(
                                                        e,
                                                        request?.id,
                                                        i
                                                    )
                                                }
                                                disabled={loadings[i]}
                                                maxLength={26}
                                                required
                                            />
                                        </div>
                                    </td>
                                    <td className="table__body-item">
                                        {request.account?.name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {request.account?.bank_name}
                                    </td>
                                    <td className="table__body-item">
                                        {!request.pay_time && (
                                            <button
                                                type="button"
                                                className={`action-btn primary`}
                                                onClick={() =>
                                                    acceptWithdrawal(
                                                        request.id,
                                                        i
                                                    )
                                                }
                                                disabled={loadings[i]}
                                            >
                                                انجام شده
                                            </button>
                                        )}
                                        {request.account?.admin_verified ===
                                            0 && (
                                            <button
                                                type="button"
                                                className={`action-btn ${
                                                    request.account
                                                        ?.admin_verified === 1
                                                        ? "success"
                                                        : "warning"
                                                }`}
                                                onClick={() =>
                                                    verifyAccount(
                                                        request.id,
                                                        request.account
                                                            ?.admin_verified,
                                                        i
                                                    )
                                                }
                                                disabled={loadings[i]}
                                            >
                                                تایید شماره شبا
                                            </button>
                                        )}
                                        {request.account?.admin_verified !==
                                            0 &&
                                            request.pay_time && (
                                                <span
                                                    style={{
                                                        width: 30,
                                                        height: 30,
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        background: "#28a745",
                                                        color: "white",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <BsCheckLg />
                                                </span>
                                            )}
                                    </td>
                                </tr>
                            ))}

                            {requests.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={7}
                                    >
                                        درخواستی وجود ندارد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {requests.length !== 0 && (
                    <Pagination read={readRequests} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default TeacherWithdrawalRequests;
