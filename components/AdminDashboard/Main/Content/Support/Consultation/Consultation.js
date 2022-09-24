import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import Pagination from "../../Pagination/Pagination";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

function Consultation(props) {
    const {
        fetchedConsultaions: { data, ...restData },
        token,
    } = props;
    const [formData, setFormData] = useState(data);
    const [consultaions, setConsultaions] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    moment.locale("fa", { useGregorianParser: true });
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const handleOnChange = (e, rowInd, name) => {
        let updated = [...formData];
        updated[rowInd] = { ...updated[rowInd], [name]: e.target.value };
        setFormData(() => updated);
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const handleLoadings = (i, value) => {
        let temp = [...loadings];
        temp[i] = value;
        setLoadings(() => temp);
    };

    const addDesc = async (e, cslt_id, i) => {
        try {
            handleLoadings(i, true);

            const res = await fetch(
                `${BASE_URL}/admin/support/consultation/${cslt_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ desc: e.target.value }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(
                    true,
                    "success",
                    e.target.value ? "توضیحات اضافه شد" : "توضیحات برداشته شد"
                );
            }

            handleLoadings(i, false);
        } catch (error) {
            console.log("Error adding description", error);
        }
    };

    const addDescHandler = async (e, consult_id, i) => {
        if (e.target.value !== consultaions[i]?.desc) {
            await addDesc(e, consult_id, i);
            let temp = [...consultaions];
            temp[i]?.desc = (e.target.value);
            setConsultaions(() => temp);
        }
    };

    const changeStatus = async (cslt_id, status, i) => {
        handleLoadings(i, true);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/support/consultation/${cslt_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ status: status === 0 ? 1 : 0 }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = "درخواست انجام شد";
                showAlert(true, "success", message);
                let updated = [...consultaions];
                updated[i] = { ...updated[i], status: status === 0 ? 1 : 0 };
                setConsultaions(() => updated);
            }
            handleLoadings(i, false);
        } catch (error) {
            console.log("Error changing status", error);
        }
    };

    const readConsultations = async (page = 1) => {
        try {
            const res = await fetch(
                `${BASE_URL}/admin/support/consultation?page=${page}`,
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
            setConsultaions(data);
            setFormData(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading consultations", error);
        }
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    adviceRequests: "درخواست مشاوره",
                    list: "لیست",
                }}
            />

            <Box title="لیست درخواست مشاوره">
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
                                <th className="table__head-item">
                                    شماره موبایل
                                </th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">لینک</th>
                                <th className="table__head-item">توضیحات</th>
                                <th className="table__head-item">تاریخ ثبت</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {consultaions?.map((clt, i) => (
                                <tr className="table__body-row" key={clt?.id}>
                                    <td className="table__body-item">
                                        {clt?.mobile}
                                        {clt?.mobile && (
                                            <Link
                                                href={`https://api.whatsapp.com/send?phone=98${clt.mobile?.slice(
                                                    1
                                                )}&text=سلام وقتتون بخیر از پشتیبانی «آموزش زبان تیکا» پیام میدم خدمتتون. شما شمارتون و جهت مشاوره زبان برای ما در سایت https://tikkaa.ir قرار دادید. برای ادامه گفتگو از طریق لینک زیر اقدام کنید yun.ir/tkChat لطفاً نام و زبان مد نظر خود را برای ما ارسال کنید تا در خدمتتون باشیم.`}
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
                                        {clt?.status === 1 ? (
                                            "انجام شده"
                                        ) : (
                                            <span className="danger">
                                                انجام نشده
                                            </span>
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        {clt?.link || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <div
                                            className="form-control"
                                            style={{
                                                minWidth: "130px",
                                                margin: 0,
                                            }}
                                        >
                                            <input
                                                type="text"
                                                name="desc"
                                                id="desc"
                                                className="form__input"
                                                onChange={(e) =>
                                                    handleOnChange(
                                                        e,
                                                        i,
                                                        "desc"
                                                    )
                                                }
                                                value={
                                                    formData[i]?.desc ||
                                                    ""
                                                }
                                                onBlur={(e) =>
                                                    addDescHandler(
                                                        e,
                                                        clt?.id,
                                                        i
                                                    )
                                                }
                                                disabled={loadings[i]}
                                                spellCheck={false}
                                            />
                                        </div>
                                    </td>
                                    <td className="table__body-item">
                                        {moment(clt?.created_at).format(
                                            "DD MMMM YYYY , HH:mm:ss"
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        {clt?.status === 0 && (
                                            <button
                                                type="button"
                                                className={`action-btn primary`}
                                                onClick={() =>
                                                    changeStatus(
                                                        clt?.id,
                                                        clt?.status,
                                                        i
                                                    )
                                                }
                                                disabled={loadings[i]}
                                            >
                                                انجام شده
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {consultaions?.length === 0 && (
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

                {consultaions.length !== 0 && (
                    <Pagination read={readConsultations} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default Consultation;
