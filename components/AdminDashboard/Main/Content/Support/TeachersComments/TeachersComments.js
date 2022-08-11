import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../constants";
import Pagination from "../../Pagination/Pagination";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";
import Modal from "../../../../../Modal/Modal";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";

function TeachersComments(props) {
    const {
        fetchedComments: { data, ...restData },
        token,
    } = props;
    const [formData, setFormData] = useState(data);
    const [comments, setComments] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [openModal, setOpenModal] = useState(false);
    const [selectedComment, setSelectedComment] = useState({});

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

    const addDesc = async (e, comment_id, i) => {
        try {
            handleLoadings(i, true);

            const res = await fetch(
                `${BASE_URL}/admin/support/teacher-comment/reply/${comment_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ admin_reply: e.target.value }),
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
                    e.target.value ? "ریپلای اضافه شد" : "ریپلای برداشته شد"
                );
            }

            handleLoadings(i, false);
        } catch (error) {
            console.log("Error adding description", error);
        }
    };

    
    const addDescHandler = async (e, comment_id, i) => {
        if (e.target.value !== comments[i]?.admin_reply) {
            await addDesc(e, comment_id, i);
            let temp = [...comments];
            temp[i]?.admin_reply = (e.target.value);
            setComments(() => temp);
        }
    };

    const changeStatus = async (comment_id, status, i) => {
        handleLoadings(i, true);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/support/teacher-comment/status/${comment_id}`,
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
                let message = `این درخواست ${
                    status === 1 ? "فعال" : "غیرفعال"
                } شد`;
                showAlert(true, status === 1 ? "success" : "warning", message);
                let updated = [...comments];
                updated[i] = { ...updated[i], status: status === 0 ? 1 : 0 };
                setComments(() => updated);
            }
            handleLoadings(i, false);
        } catch (error) {
            console.log("Error changing status", error);
        }
    };

    const readComments = async (page = 1) => {
        try {
            const res = await fetch(
                `${BASE_URL}/admin/support/teacher-comment?page=${page}`,
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
            setComments(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading comments", error);
        }
    };

    return (
        <div>
            <Box title="کامنت های اساتید">
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
                        <h3 className={"modal__title"}>جزئیات کامنت</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    وضعیت کلاس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedComment?.status === 1
                                        ? "انجام شده"
                                        : "انجام نشده"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    تاریخ ثبت
                                </span>
                                <span className={"modal__item-body"}>
                                    {moment(selectedComment?.created_at).format(
                                            "YYYY/MM/DD hh:mm:ss"
                                        )}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ریپلای استاد
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedComment?.teacher_reply || "-"}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">زبان آموز</th>
                                <th className="table__head-item">شماره زبان آموز</th>
                                <th className="table__head-item">ip زبان آموز</th>
                                <th className="table__head-item table__head-item--ellipsis">نظر</th>
                                <th className="table__head-item">ریپلای ادمین</th>
                                <th className="table__head-item">امتیاز کلی</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {comments?.map((comment, i) => (
                                <tr
                                    className="table__body-row"
                                    key={comment?.id}
                                >
                                    <td className="table__body-item">
                                        {comment?.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {comment?.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        {comment?.mobile}
                                        {comment?.mobile && (
                                            <Link
                                                href={`https://api.whatsapp.com/send?phone=${comment.mobile}`}
                                            >
                                                <a className="whatsapp-icon" target="_blank">
                                                    <span>
                                                        <AiOutlineWhatsApp />
                                                    </span>
                                                </a>
                                            </Link>
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        {comment?.ip || "-"}
                                    </td>
                                    <td 
                                        className="table__body-item table__body-item--ellipsis"
                                        style={{
                                            width: 300,
                                        }}
                                    >
                                        {comment?.comment}
                                    </td>
                                    <td className="table__body-item">
                                        <div
                                            className="form-control"
                                            style={{
                                                minWidth: "130px",
                                                height: "30px",
                                                margin: 0
                                            }}
                                        >
                                            <input
                                                type="text"
                                                name="admin_reply"
                                                id="admin_reply"
                                                className="form__input"
                                                onChange={(e) =>
                                                    handleOnChange(
                                                        e,
                                                        i,
                                                        "admin_reply"
                                                    )
                                                }
                                                value={
                                                    formData[i]?.admin_reply ||
                                                    ""
                                                }
                                                onBlur={(e) =>
                                                    addDescHandler(
                                                        e,
                                                        comment?.id,
                                                        i
                                                    )
                                                }
                                                disabled={loadings[i]}
                                                spellCheck={false}
                                            />
                                        </div>
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {comment?.score}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                comment?.status === 1
                                                    ? "success"
                                                    : "warning"
                                            }`}
                                            onClick={() =>
                                                changeStatus(
                                                    comment?.id,
                                                    comment?.status,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            {comment?.status === 0
                                                ? "فعال"
                                                : "غیرفعال"}
                                        </button>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedComment(comment);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {comments?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={9}
                                    >
                                        کامنتی وجود ندارد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {comments.length !== 0 && (
                    <Pagination read={readComments} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default TeachersComments;
