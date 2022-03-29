import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../constants";
import Pagination from "../../Pagination/Pagination";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";

function Requests(props) {
    const {
        fetchedRequests: { data, ...restData },
        token,
    } = props;
    const [formData, setFormData] = useState(data);
    const [Requests, setRequests] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const handleLoadings = (i, value) => {
        let temp = [...loadings];
        temp[i] = value;
        setLoadings(() => temp);
    };

    const changeStatus = async (request_id, status, i) => {
        handleLoadings(i, true);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/support/reserve/not-finished/${request_id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = `این درخواست ${
                    status === 1 ? "فعال" : "غیرفعال"
                } شد`;
                showAlert(true, status === 1 ? "success" : "warning", message);
                let updated = [...Requests];
                updated[i] = { ...updated[i], status: status === 0 ? 1 : 0 };
                setRequests(() => updated);
            }
            handleLoadings(i, false);
        } catch (error) {
            console.log("Error changing status", error);
        }
    };

    const readRequests = async (page = 1) => {
        try {
            const res = await fetch(
                `${BASE_URL}/admin/support/reserve/not-finished?page=${page}`,
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

    return (
        <div>
            <Box title="لیست درخواست های ناتمام">
                {/* Alert */}
                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={changeStatus}
                />

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">
                                    نام زبان آموز
                                </th>
                                <th className="table__head-item">
                                    شماره موبایل زبان آموز
                                </th>
                                <th className="table__head-item">نوع کلاس</th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">تاریخ ثبت</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {Requests?.map((req, i) => (
                                <tr className="table__body-row" key={req?.id}>
                                    <td className="table__body-item">
                                        {req?.mobile}
                                    </td>
                                    <td className="table__body-item">
                                        {req?.status === 1
                                            ? "انجام شده"
                                            : "انجام نشده"}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment(req?.created_at).format(
                                            "YYYY/MM/DD hh:mm:ss"
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                req?.status === 1
                                                    ? "success"
                                                    : "warning"
                                            }`}
                                            onClick={() =>
                                                changeStatus(
                                                    req?.id,
                                                    req?.status,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            {req?.status === 0
                                                ? "فعال"
                                                : "غیرفعال"}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {Requests?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={5}
                                    >
                                        درخواستی وجود ندارد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {Requests.length !== 0 && (
                    <Pagination read={readRequests} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default Requests;
