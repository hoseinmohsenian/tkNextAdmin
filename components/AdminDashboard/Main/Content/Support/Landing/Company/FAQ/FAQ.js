import { useState } from "react";
import styles from "./FAQ.module.css";
import Box from "../../../../Elements/Box/Box";
import Alert from "../../../../../../../Alert/Alert";
import { useRouter } from "next/router";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import BreadCrumbs from "../../../../Elements/Breadcrumbs/Breadcrumbs";
import API from "../../../../../../../../api";

function FAQ({ FAQList, organization_id, faq_title }) {
    const [FAQs, setFAQs] = useState(FAQList);
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(Array(FAQs.length).fill(false));
    const router = useRouter();
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });

    const handleRouter = () => {
        router.push("/tkpanel/landing/company");
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const addNewRow = () => {
        let newRow = ["id", "question", "answer"].reduce(
            (acc, curr) => ((acc[curr] = ""), acc),
            {}
        );
        setFAQs([...FAQs, newRow]);
        setLoadings([...loadings, false]);
    };

    const handleOnChange = (value, rowInd, name) => {
        let updated = [...FAQs];
        updated[rowInd] = { ...updated[rowInd], [name]: value };
        setFAQs(() => updated);
    };

    const deleteRow = (rowInd) => {
        let updated = [...FAQs];
        updated = updated.filter((_, ind) => rowInd !== ind);
        setFAQs(() => updated);
        setLoadings(() => loadings.slice(0, loadings.length - 1));
    };

    const addFAQ = async (body, rowInd) => {
        setLoading(true);
        try {
            const { response, status, data } = await API.post(
                `/admin/organization/marketing/faq`,
                JSON.stringify({
                    ...body,
                    organization_id: Number(organization_id),
                })
            );

            if (status === 200) {
                let updated = [...FAQs];
                updated[rowInd] = {
                    ...updated[rowInd],
                    id: data?.data,
                };
                setFAQs(() => updated);
                let message = "FAQ جدید باموفقیت ثبت شد";
                showAlert(true, "success", message);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error adding new FAQ", error);
        }
        setLoading(false);
    };

    const editFAQ = async (body, faq_id) => {
        setLoading(true);
        try {
            const { response, status } = await API.post(
                `/admin/organization/marketing/faq/${faq_id}`,
                JSON.stringify(body)
            );

            if (status === 200) {
                let message = "این FAQ ویرایش شد";
                showAlert(true, "success", message);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error editing faq", error);
        }
        setLoading(false);
    };

    const onEditHandler = async (rowInd, id) => {
        if (!isEmpty(rowInd)) {
            let body = {};
            if (
                FAQs[rowInd].question &&
                FAQs[rowInd].question !== FAQList[rowInd]?.question
            ) {
                body = { ...body, question: FAQs[rowInd].question };
            }
            if (
                FAQs[rowInd].answer &&
                FAQs[rowInd].answer !== FAQList[rowInd]?.answer
            ) {
                body = { ...body, answer: FAQs[rowInd].answer };
            }
            await editFAQ(body, id);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const onAddHandler = async (rowInd) => {
        if (!isEmpty(rowInd)) {
            let body = {
                question: FAQs[rowInd].question,
                answer: FAQs[rowInd].answer,
            };
            await addFAQ(body, rowInd);
        } else {
            showAlert(true, "danger", "لطفا فیلدها را تکمیل کنید");
        }
    };

    const isEmpty = (rowInd) => {
        if (!FAQs[rowInd]?.question || !FAQs[rowInd]?.answer) {
            return true;
        }
        return false;
    };

    const handleLoadings = (value, i) => {
        let temp = [...loadings];
        temp[i] = value;
        setLoadings(() => temp);
    };

    const deleteFAQ = async (faq_id, i) => {
        handleLoadings(true, i);
        try {
            const { status, response } = await API.delete(
                `/admin/organization/marketing/faq/${faq_id}`
            );

            if (status === 200) {
                const filteredFAQs = FAQs.filter((faq) => faq.id !== faq_id);
                setFAQs(filteredFAQs);
                showAlert(true, "danger", "این سوال حذف شد");
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error deleting faq", error);
        }
        handleLoadings(false, i);
    };

    const deleteHandler = async (i) => {
        const faq_id = FAQs[i].id;
        if (faq_id) {
            await deleteFAQ(faq_id, i);
        } else {
            deleteRow(i);
        }
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={addFAQ || editFAQ}
            />

            <BreadCrumbs
                substituteObj={{
                    landing: "لندینگ",
                    company: "لندینگ شرکتی",
                    faq: "FAQ",
                }}
            />

            <Box title={`${faq_title}`}>
                <div className="form">
                    {FAQs?.map((item, i) => (
                        <div key={i}>
                            <div className={styles["faq-header"]}>
                                <h3 className={styles["faq-title"]}>
                                    سوال {i + 1} :
                                </h3>
                                <div className={styles["faq-row-btn-wrapper"]}>
                                    <button
                                        className={`danger ${styles["faq-btn"]}`}
                                        type="button"
                                        onClick={() => deleteHandler(i)}
                                        title="حذف"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                    {item?.id ? (
                                        <button
                                            type="button"
                                            className={`primary ${styles["faq-btn"]}`}
                                            onClick={() =>
                                                onEditHandler(i, item?.id)
                                            }
                                            title="ویرایش"
                                            disabled={loadings[i]}
                                        >
                                            <MdEdit />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className={`primary ${styles["faq-btn"]}`}
                                            onClick={() => onAddHandler(i)}
                                            title="ثبت"
                                            disabled={loadings[i]}
                                        >
                                            <FaCheck />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className={styles["faq-row"]}>
                                <div className={styles["inputs-container"]}>
                                    <div className="row">
                                        <div
                                            className={`col-md-6 ${styles["faq-col"]}`}
                                        >
                                            <div
                                                className={`input-wrapper ${styles["faq-input-wrapper"]}`}
                                            >
                                                <label
                                                    htmlFor="question"
                                                    className={`form__label ${styles["faq-label"]}`}
                                                >
                                                    سوال :
                                                </label>
                                                <div className="form-control">
                                                    <input
                                                        type="text"
                                                        name="question"
                                                        id="question"
                                                        className="form__input"
                                                        onChange={(e) =>
                                                            handleOnChange(
                                                                e.target.value,
                                                                i,
                                                                e.target.name
                                                            )
                                                        }
                                                        value={item?.question}
                                                        required
                                                        placeholder="سوال"
                                                        spellCheck={false}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`col-md-6 ${styles["faq-col"]}`}
                                        >
                                            <div
                                                className={`input-wrapper ${styles["faq-input-wrapper"]}`}
                                            >
                                                <label
                                                    htmlFor="answer"
                                                    className={`form__label ${styles["faq-label"]}`}
                                                >
                                                    جواب :
                                                </label>
                                                <div className="form-control">
                                                    <input
                                                        type="text"
                                                        name="answer"
                                                        id="answer"
                                                        className="form__input"
                                                        onChange={(e) =>
                                                            handleOnChange(
                                                                e.target.value,
                                                                i,
                                                                e.target.name
                                                            )
                                                        }
                                                        value={item?.answer}
                                                        required
                                                        placeholder="جواب"
                                                        spellCheck={false}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className={styles["faq-add-btn-wrapper"]}>
                        <button
                            className={`success ${styles["faq-add-btn"]}`}
                            type="button"
                            onClick={addNewRow}
                        >
                            اضافه کردن سوال
                            <span className={styles["faq-add-btn-icon"]}>
                                <IoAddSharp />
                            </span>
                        </button>
                    </div>

                    <button
                        type="button"
                        className="btn primary"
                        disabled={loading}
                        onClick={handleRouter}
                    >
                        {loading
                            ? "در حال انجام ..."
                            : "بازگشت به لیست لندینگ‌‌ها"}
                    </button>
                </div>
            </Box>
        </div>
    );
}

export default FAQ;
