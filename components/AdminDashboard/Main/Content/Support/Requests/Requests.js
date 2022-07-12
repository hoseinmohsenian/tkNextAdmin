import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../constants";
import Pagination from "../../Pagination/Pagination";
import Box from "../../Elements/Box/Box";
import { useRouter } from "next/router";
import Modal from "../../../../../Modal/Modal";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";

function Requests(props) {
    const {
        fetchedRequests: { data, ...restData },
        token,
    } = props;
    const [requests, setRequests] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [openModal, setOpenModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState({});
    const router = useRouter();

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const handleLoadings = (i, value) => {
        let temp = [...loadings];
        temp[i] = value;
        setLoadings(() => temp);
    };

    const changeStatus = async (request_id, i) => {
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
                let message = "تغییر وضعیت اعمال شد";
                showAlert(true, "success", message);
                let updated = requests.filter((item) => item.id !== request_id);
                setRequests(() => updated);
            }
            handleLoadings(i, false);
        } catch (error) {
            console.log("Error changing status", error);
        }
    };

    const readRequests = async (page = 1) => {
        let params = { page };

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
            if (res.status === 500) {
                showAlert(true, "danger", "مشکلی پیش آمده: خطای ۵۰۰");
            }
            if (res.ok) {
                router.push({
                    pathname: `/tkpanel/requestFailed`,
                    query: params,
                });
            }
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

                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات درخواست</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    وضعیت کلاس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedRequest?.status === 1
                                        ? "فعال"
                                        : "غیرفعال"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    زبان
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedRequest?.language_name || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    استپ
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedRequest?.step || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    کلاس اول
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedRequest?.first_class === 1
                                        ? "است"
                                        : "نیست"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    نمایش ادمین
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedRequest?.show_admin === 1
                                        ? "نمایان"
                                        : "غیرنمایان"}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">
                                    نام زبان آموز
                                </th>
                                <th className="table__head-item">
                                    موبایل زبان آموز
                                </th>
                                <th className="table__head-item">زمان</th>
                                <th className="table__head-item">
                                    قابل پرداخت
                                </th>
                                <th className="table__head-item">تخفیف</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {requests?.map((req, i) => (
                                <tr className="table__body-row" key={req?.id}>
                                    <td className="table__body-item">
                                        {req?.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {req?.user_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {req?.user_mobile}
                                        {req?.user_mobile && (
                                            <Link
                                                href={`https://api.whatsapp.com/send?phone=${req.user_mobile}`}
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
                                        {req?.time} دقیقه
                                    </td>
                                    <td className="table__body-item">
                                        {Intl.NumberFormat().format(
                                            req?.payable
                                        )}{" "}
                                        تومان
                                    </td>
                                    <td className="table__body-item">
                                        {Intl.NumberFormat().format(
                                            req?.discount
                                        )}{" "}
                                        تومان
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            type="button"
                                            className={`action-btn warning`}
                                            onClick={() =>
                                                changeStatus(req?.id, i)
                                            }
                                            disabled={loadings[i]}
                                        >
                                            تغییر وضعیت
                                        </button>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedRequest(req);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {requests?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={13}
                                    >
                                        درخواستی وجود ندارد
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

export default Requests;
