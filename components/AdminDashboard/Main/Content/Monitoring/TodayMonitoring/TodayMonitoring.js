import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";
import styles from "./TodayMonitoring.module.css";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import moment from "jalali-moment";
import { useGlobalContext } from "../../../../../../context";
import Modal from "../../../../../Modal/Modal";
import { AiOutlineWhatsApp, AiOutlineInfoCircle } from "react-icons/ai";
import Link from "next/link";
import ReactTooltip from "react-tooltip";

function TodayMonitoring({ token, monitorings, shamsi_date_obj, admins }) {
    const [monitoringList, setMonitoringList] = useState(monitorings);
    const [formData, setFormData] = useState(monitorings);
    const [selectedDate, setSelectedDate] = useState(shamsi_date_obj);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    moment.locale("fa", { useGregorianParser: true });
    const { formatTime } = useGlobalContext();
    const [openModal, setOpenModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

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
                `${BASE_URL}/admin/classroom/monitoring?${searchQuery}`,
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
            setFormData(data);
            setLoading(false);
        } catch (error) {
            console.log("Error reading monitoring list", error);
        }
    };

    const addFollower = async (monitoring_id, monitoring_follower, i) => {
        try {
            setFollowLoading(true);
            const res = await fetch(
                `${BASE_URL}/admin/classroom/monitoring/${monitoring_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ admin_id: monitoring_follower }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(true, "success", "?????????? ???????????????? ?????????? ????");
                updateListHandler(i);
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "?????????? ?????? ????????"
                );
            }
            setFollowLoading(false);
        } catch (error) {
            console.log("Error adding monitoring follower", error);
        }
    };

    const addFollowerHandler = async (id, i) => {
        if (
            selectedClass.monitoring_follower !==
            monitoringList[i]?.monitoring_follower
        ) {
            await addFollower(id, selectedClass.monitoring_follower, i);
        }
    };

    const handleOnChange = (e, rowInd) => {
        let updatedList = [...formData];
        let updatedItem = {
            ...updatedList[rowInd],
            ...selectedClass,
            monitoring_follower: Number(e.target.value),
        };
        updatedList[rowInd] = updatedItem;
        setSelectedClass(updatedItem);
        setFormData(() => updatedList);
    };

    const updateListHandler = (i) => {
        let temp = [...monitoringList];
        temp[i] = { ...temp[i], ...selectedClass };
        temp[i].monitoring_follower = selectedClass.monitoring_follower;
        setSelectedClass(temp[i]);
        setMonitoringList(() => temp);
        setFormData(() => temp);
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={readMonitoring}
            />
            <Box title="???????????????????? ??????????">
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
                                    {selectedClass?.platform_name || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass.language_name}
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
                                    ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.price
                                        ? `${Intl.NumberFormat().format(
                                              selectedClass?.price
                                          )} ??????????`
                                        : "-"}
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
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ???????????? ????????
                                </span>
                                <span
                                    className={"modal__item-body"}
                                    style={{ display: "flex" }}
                                >
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <select
                                            name="language_id"
                                            id="language_id"
                                            className="form__input input-select"
                                            onChange={(e) =>
                                                handleOnChange(
                                                    e,
                                                    selectedClass.index
                                                )
                                            }
                                            value={
                                                selectedClass.monitoring_follower ||
                                                0
                                            }
                                            required
                                        >
                                            <option value={0}>
                                                ???????????? ????????
                                            </option>
                                            {admins.map((admin) => (
                                                <option
                                                    key={admin.id}
                                                    value={admin.id}
                                                >
                                                    {admin.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        className={`action-btn primary`}
                                        onClick={() =>
                                            addFollowerHandler(
                                                selectedClass.id,
                                                selectedClass.index
                                            )
                                        }
                                        disabled={followLoading}
                                    >
                                        ??????
                                    </button>
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
                                <th className="table__head-item">?????????? ????????</th>
                                <th className="table__head-item">
                                    ?????????? ????????????
                                </th>
                                <th className="table__head-item">??????????</th>
                                <th className="table__head-item">??????????????</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {monitoringList?.map((item, i) => {
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
                                            {item?.status === 0 &&
                                                "?????????? ?????????? ????????"}
                                            {item?.status === 1 && "???????????? ??????"}
                                            {item?.status === 2 && "???????? ??????"}
                                            {item?.status === 3 &&
                                                "?????? ???????????? ??????"}
                                            {item?.status === 4 && "????????"}
                                        </td>
                                        <td className="table__body-item">
                                            {item?.pay === 1
                                                ? "???????????? ??????"
                                                : "???????????? ????????"}
                                        </td>
                                        <td className="table__body-item">
                                            {date}
                                        </td>
                                        <td className="table__body-item">
                                            <button
                                                className={`action-btn success`}
                                                onClick={() => {
                                                    setSelectedClass(() => {
                                                        return {
                                                            ...item,
                                                            index: i,
                                                        };
                                                    });
                                                    setOpenModal(true);
                                                }}
                                            >
                                                ????????????
                                            </button>
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

export default TodayMonitoring;
