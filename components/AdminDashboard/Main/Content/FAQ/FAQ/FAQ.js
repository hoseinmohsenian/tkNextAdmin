import { useState } from "react";
import Link from "next/link";
import Box from "../../Elements/Box/Box";
import Alert from "../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../constants";

function FAQ({ faqs: fetchedData, token }) {
    const [faqs, setFaqs] = useState(fetchedData);
    const [loadings, setLoadings] = useState(Array(faqs?.length).fill(false));
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const changePin = async (q_id, pin, i) => {
        loadingHandler(i, true);

        try {
            const res = await fetch(`${BASE_URL}/admin/faq/question/${q_id}`, {
                method: "POST",
                body: JSON.stringify({ pin: pin === 0 ? 1 : 0 }),
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                let message = `این سوال ${
                    pin === 0 ? "پین شد" : "از پین درآمد"
                }`;
                showAlert(true, pin === 0 ? "success" : "warning", message);
                let updated = [...faqs];
                updated[i] = { ...updated[i], pin: pin === 0 ? 1 : 0 };
                setFaqs(() => updated);
            }
            loadingHandler(i, false);
        } catch (error) {
            console.log("Error changing pin", error);
        }
    };

    const changeShow = async (q_id, show, i) => {
        loadingHandler(i, true);

        try {
            const res = await fetch(`${BASE_URL}/admin/faq/question/${q_id}`, {
                method: "POST",
                body: JSON.stringify({ show: show === 0 ? 1 : 0 }),
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                let message = `این سوال ${show === 0 ? "نمایان" : "پنهان"} شد`;
                showAlert(true, show === 0 ? "success" : "warning", message);
                let updated = [...faqs];
                updated[i] = { ...updated[i], show: show === 0 ? 1 : 0 };
                setFaqs(() => updated);
            }
            loadingHandler(i, false);
        } catch (error) {
            console.log("Error changing show", error);
        }
    };

    const loadingHandler = (ind, value) => {
        let temp = [...loadings];
        temp[ind] = value;
        setLoadings(() => temp);
    };

    return (
        <div>
            <Box
                title="سوالات FAQ"
                buttonInfo={{
                    name: "ایجاد سوال",
                    url: "/tkpanel/FaqSite/create",
                    color: "primary",
                }}
            >
                {/* Alert */}
                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={changeShow}
                />

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">عنوان</th>
                                <th
                                    className="table__head-item"
                                    style={{ fontSize: "1rem" }}
                                >
                                    url
                                </th>
                                <th className="table__head-item">عنوان متا</th>
                                <th className="table__head-item">امتیاز</th>
                                <th className="table__head-item">
                                    شماره امتیاز
                                </th>
                                <th className="table__head-item">
                                    وضعیت نمایش
                                </th>
                                <th className="table__head-item">وضعیت پین‌</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {faqs?.map((catg, i) => (
                                <tr className="table__body-row" key={catg?.id}>
                                    <td className="table__body-item">
                                        {catg.title}
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.url}
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.meta_title || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.score}
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.score_number}
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.show ? "نمایش" : "عدم نمایش"}
                                    </td>
                                    <td className="table__body-item">
                                        {catg?.pin ? "پین شده" : "پین نشده"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/FaqSite/${catg.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                catg?.pin === 1
                                                    ? "danger"
                                                    : "success"
                                            }`}
                                            onClick={() =>
                                                changePin(
                                                    catg?.id,
                                                    catg?.pin,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            {catg?.pin === 1 ? "غیرپین" : "پین"}
                                        </button>
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                catg?.show === 1
                                                    ? "danger"
                                                    : "success"
                                            }`}
                                            onClick={() =>
                                                changeShow(
                                                    catg?.id,
                                                    catg?.show,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            {catg?.show === 1
                                                ? "پنهان"
                                                : "نمایش"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Box>
        </div>
    );
}

export default FAQ;
