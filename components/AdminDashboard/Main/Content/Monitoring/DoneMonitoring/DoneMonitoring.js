import { useState } from "react";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";
import styles from "./DoneMonitoring.module.css";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import moment from "jalali-moment";
import Link from "next/link";
import { useGlobalContext } from "../../../../../../context";
import Modal from "../../../../../Modal/Modal";
import { AiOutlineWhatsApp, AiOutlineInfoCircle } from "react-icons/ai";
import ReactTooltip from "react-tooltip";

function DoneMonitoring({ token, monitorings, shamsi_date_obj }) {
    const [monitoringList, setMonitoringList] = useState(monitorings);
    const [selectedDate, setSelectedDate] = useState(shamsi_date_obj);
    const [loading, setLoading] = useState(false);
    moment.locale("fa", { useGregorianParser: true });
    const { formatTime } = useGlobalContext();
    const [openModal, setOpenModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});

    const readMonitoring = async () => {
        // Constructing search parameters
        let searchQuery = "";
        let date = moment
            .from(
                `${selectedDate?.year}/${selectedDate?.month}/${selectedDate?.day}`,
                "fa",
                "YYYY/MM/DD"
            )
            .locale("en")
            .format("YYYY/MM/DD")
            .replace("/", "-")
            .replace("/", "-");
        searchQuery = `date=${date}`;

        try {
            setLoading(true);
            const res = await fetch(
                `${BASE_URL}/admin/classroom/monitoring/done?${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setMonitoringList(data);
            setLoading(false);
        } catch (error) {
            console.log("Error reading monitoring list", error);
        }
    };

    return (
        <div>
            <Box title="???????????????????? ?????????? ??????">
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>???????????? ??????????????</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ???????????? ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.monitoring_follower_name ||
                                        "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.course_name}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ????????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.platform_name}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ?????????? ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.status === 0 &&
                                        "?????????? ?????????? ????????"}
                                    {selectedClass?.status === 1 &&
                                        "???????????? ??????"}
                                    {selectedClass?.status === 2 && "???????? ??????"}
                                    {selectedClass?.status === 3 &&
                                        "?????? ???????????? ??????"}
                                    {selectedClass?.status === 4 && "????????"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ???????? ??????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.first_class === 1
                                        ? "??????"
                                        : "????????"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ?????????? ????????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.pay === 1
                                        ? "???????????? ??????"
                                        : "???????????? ????????"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ?????? ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.class_time
                                        ? `${selectedClass?.class_time} ??????????`
                                        : "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ???????? ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass.time
                                        ? formatTime(selectedClass.time)
                                        : "-"}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <ReactTooltip className="tooltip" />

                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`${styles["search-row"]}`}>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label
                                    htmlFor="publish_time"
                                    className={`form__label ${styles["search-label"]}`}
                                >
                                    ????????????? :
                                </label>
                                <div className="form-control">
                                    <DatePicker
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                        shouldHighlightWeekends
                                        locale="fa"
                                        wrapperClassName="date-input-wrapper"
                                        inputClassName="date-input"
                                        colorPrimary="#545cd8"
                                        inputPlaceholder="???????????? ????????"
                                    />
                                </div>
                            </div>
                            <div className={styles["btn-wrapper"]}>
                                <button
                                    type="button"
                                    className={`btn primary ${styles["btn"]}`}
                                    disabled={loading}
                                    onClick={() => readMonitoring()}
                                >
                                    {loading ? "???? ?????? ?????????? ..." : "??????????"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">???????? ????????</th>
                                <th className="table__head-item">
                                    ???????????? ???????? ????????
                                </th>
                                <th className="table__head-item">??????????</th>
                                <th className="table__head-item">????????</th>
                                <th className="table__head-item">????????</th>
                                <th className="table__head-item">??????????</th>
                                <th className="table__head-item">??????????????</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {monitoringList?.map((item) => {
                                let date = item?.date
                                    ? `${moment
                                          .from(
                                              item?.date
                                                  .replace("-", "/")
                                                  .replace("-", "/"),
                                              "en",
                                              "YYYY/MM/DD"
                                          )
                                          .locale("fa")
                                          .format("DD MMMM YYYY")} , ${
                                          item?.time && item?.time !== "[]"
                                              ? formatTime(item?.time)
                                              : "-"
                                      }`
                                    : "-";

                                return (
                                    <tr
                                        className="table__body-row"
                                        key={item?.id}
                                    >
                                        <td className="table__body-item">
                                            {item?.user_name}
                                        </td>
                                        <td className="table__body-item">
                                            {item?.user_mobile || "-"}
                                            {item?.user_mobile && (
                                                <Link
                                                    href={`https://api.whatsapp.com/send?phone=${item.user_mobile}&text=???????? ${item.user_name} ???????? ?????? ???????? ?????????????? ?????????????? ???????????? ?????????? ???????? ???????? ????????. ???????? ???????? ${date} ???? ?????????? ${item?.teacher_name} ?????????? ???? ??????. ???????? ???????? ???? ?????????? ?????? ???????? ?????? ???? ?????????? ??????????(sms) ???? ??????. ???????? ??????????.`}
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
                                        <td
                                            className="table__body-item"
                                            data-tip={
                                                item?.teacher_mobile || "-"
                                            }
                                        >
                                            {item?.teacher_name}
                                            <span className="info-icon">
                                                <AiOutlineInfoCircle />
                                            </span>
                                        </td>
                                        <td className="table__body-item">
                                            {item?.language_name}
                                        </td>
                                        <td className="table__body-item">
                                            {item?.price
                                                ? `${Intl.NumberFormat().format(
                                                      item?.price
                                                  )} ??????????`
                                                : "-"}
                                        </td>
                                        <td className="table__body-item">
                                            {date}
                                        </td>
                                        <td className="table__body-item">
                                            <button
                                                className={`action-btn success`}
                                                onClick={() => {
                                                    setSelectedClass(item);
                                                    setOpenModal(true);
                                                }}
                                            >
                                                ????????????
                                            </button>
                                            <Link
                                                href={`/tkpanel/multiSessionsList/logs/${item.id}?type=monitoring`}
                                            >
                                                <a
                                                    className={`action-btn warning`}
                                                    target="_blank"
                                                >
                                                    ?????? ????????????
                                                </a>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}

                            {monitoringList.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={16}
                                    >
                                        ?????????? ???????? ??????
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>
        </div>
    );
}

export default DoneMonitoring;
