import { useState } from "react";
import Pagination from "../../Pagination/Pagination";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";
import { useRouter } from "next/router";
import { AiOutlineWhatsApp, AiOutlineInfoCircle } from "react-icons/ai";
import Link from "next/link";
import { useGlobalContext } from "../../../../../../context";
import ReactTooltip from "react-tooltip";
import Modal from "../../../../../Modal/Modal";
import Alert from "../../../../../Alert/Alert";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";
import styles from "./RequestDetails.module.css";

const filtersSchema = {
    teacher_name: "",
    teacher_mobile:"",
    user_name:"",
    user_mobile:"",
    status: -1,
};
const appliedFiltersSchema = {
    teacher_name: false,
    teacher_mobile: false,
    user_name: false,
    user_mobile: false,
    status: false,
};

function RequestDetails(props) {
    const {
        fetchedClasses: { data, ...restData },
        token,
        searchData
    } = props;
    const [classes, setClasses] = useState(data);
    const [formData, setFormData] = useState(data);
    const [filters, setFilters] = useState(searchData);
    const [appliedFilters, setAppliedFilters] = useState(searchData);
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState({});
    const [loading, setLoading] = useState(false);
    const { formatTime } = useGlobalContext();
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    moment.locale("fa", { useGregorianParser: true });
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const handleFilterOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    const readClasses = async (page = 1, avoidFilters = false) => {
        let searchParams = {};
        const isFilterEnabled = (key) => 
            Number(filters[key]) !== -1 && 
            filters[key] !== undefined && 
            filters[key] !== "";

        // Constructing search parameters
        let searchQuery = "";
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };

            Object.keys(filters).forEach((key) => {
                if (isFilterEnabled(key)) {
                    searchParams = {
                        ...searchParams,
                        [key]: filters[key],
                    };
                    tempFilters[key] = true;
                    searchQuery += `${key}=${filters[key]}&`;
                }
                else{
                    tempFilters[key] = false;
                }
            });

            setAppliedFilters(tempFilters);
        }
        searchQuery += `page=${page}`;

        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }
        
        router.push({
            pathname: `/tkpanel/teacher/request/lists`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/classroom/first-request?${searchQuery}`,
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
            console.log("Error reading classes", error);
        }
    };

    const handleOnChange = (e, rowInd) => {
        let updatedList = [...formData];
        let updatedItem = { ...updatedList[rowInd], ...selectedRequest, status: e.target.value };
        updatedList[rowInd] = updatedItem;
        setSelectedRequest(updatedItem);
        setFormData(() => updatedList);
    };

    const changeStatusHandler = async (request_id, i) => {
        if (
            selectedRequest.status !== classes[i]?.status 
        ) {
            await changeStatus(selectedRequest.status, request_id, i);
        }
    };

    const changeStatus = async (value, request_id, i) => {
        try {
            setLoading(true)

            const res = await fetch(
                `${BASE_URL}/admin/classroom/reserve-status/${request_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ status: Number(value) }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = `تغییر وضعیت کلاس ثبت شد`;
                showAlert(true, "success", message);
                updateListHandler(i);
            }
            else{
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }

            setLoading(false)
        } catch (error) {
            console.log("Error changing status", error);
        }
    };

    const updateListHandler = (i) => {
        let temp = [...classes];
            temp[i] = {...temp[i], ...selectedRequest};
            temp[i]?.status = Number(selectedRequest.status);
            setSelectedRequest(temp[i]);
            setClasses(() => temp);
            setFormData(() => temp);
    }

    const showFilters = () => {
        const keys = Object.keys(appliedFilters);
        const values = Object.values(appliedFilters);
        for (let i = 0; i < values.length; i++) {
            let value = values[i], key = keys[i];
            if (value || (key === "status" && value === -1)) {
                return false;
            }
        }
        return true;
    };

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);
        readClasses(1, true);
        router.push({
            pathname: `/tkpanel/teacher/request/lists`,
            query: {},
        });
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    teacher: "کلاس",
                    request: "وضعیت درخواست کلاس",
                    lists: "لیست"
                }}
            />

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={changeStatus}
            />

            <Box title="وضعیت درخواست کلاس">
                <ReactTooltip className="tooltip" />

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
                                    تخفیف
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedRequest?.discount
                                        ? `${Intl.NumberFormat().format(
                                              selectedRequest?.discount
                                          )} تومان`
                                        : "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    مدت زمان
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedRequest.time
                                        ? `${selectedRequest?.time} دقیقه`
                                        : "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    استپ
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedRequest?.step}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    وضعیت
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
                                                    selectedRequest.index
                                                )
                                            }
                                            value={selectedRequest.status}
                                            required
                                        >
                                            <option value={0}>
                                                در انتظار تایید
                                            </option>
                                            <option value={1}>تایید</option>
                                            <option value={2}>کنسل</option>
                                        </select>
                                    </div>
                                    <button
                                        className={`action-btn primary`}
                                        onClick={() => changeStatusHandler(selectedRequest.id, selectedRequest.index)}
                                        disabled={loading}
                                    >
                                        ثبت
                                    </button>
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="teacher_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        نام استاد :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="teacher_name"
                                            id="teacher_name"
                                            className="form__input"
                                            onChange={handleFilterOnChange}
                                            value={filters?.teacher_name}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="teacher_mobile"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        موبایل استاد :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="teacher_mobile"
                                            id="teacher_mobile"
                                            className="form__input"
                                            onChange={handleFilterOnChange}
                                            value={filters?.teacher_mobile}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="user_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        نام زبان آموز :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="user_name"
                                            id="user_name"
                                            className="form__input"
                                            onChange={handleFilterOnChange}
                                            value={filters?.user_name}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="user_mobile"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        موبایل زبان آموز :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="user_mobile"
                                            id="user_mobile"
                                            className="form__input"
                                            onChange={handleFilterOnChange}
                                            value={filters?.user_mobile}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="status"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        وضعیت :
                                    </label>
                                    <div className="form-control">
                                        <select
                                            name="status"
                                            id="status"
                                            className="form__input input-select"
                                            onChange={handleFilterOnChange}
                                            value={filters.status}
                                        >
                                            <option value={-1}>
                                                همه
                                            </option>
                                            <option value={0}>
                                                در انتظار تایید
                                            </option>
                                            <option value={1}>تایید شده</option>
                                            <option value={2}>کنسل</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles["btn-wrapper"]}>
                            <button
                                type="button"
                                className={`btn primary ${styles["btn"]}`}
                                disabled={loading}
                                onClick={() => readClasses()}
                            >
                                {loading ? "در حال انجام ..." : "اعمال فیلتر"}
                            </button>
                            {!showFilters() && (
                                <button
                                    type="button"
                                    className={`btn danger-outline ${styles["btn"]}`}
                                    disabled={loading}
                                    onClick={() => removeFilters()}
                                >
                                    {loading ? "در حال انجام ..." : "حذف فیلتر"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام زبان آموز
                                </th>
                                <th className="table__head-item">
                                    شماره زبان آموز
                                </th>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">
                                    قابل پرداخت
                                </th>
                                <th className="table__head-item">وضعیت کلاس</th>
                                <th className="table__head-item">تاریخ کلاس</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {classes?.map((item, i) => {
                                let date = item.classroom?.date
                                    ? `${moment
                                          .from(
                                              item.classroom?.date
                                                  .replace("-", "/")
                                                  .replace("-", "/"),
                                              "en",
                                              "YYYY/MM/DD"
                                          )
                                          .locale("fa")
                                          .format("DD MMMM YYYY")} , ${
                                          item.classroom?.time &&
                                          item.classroom?.time !== "[]"
                                              ? formatTime(item.classroom?.time)
                                              : "-"
                                      }`
                                    : "-";
                                return (
                                    <tr
                                        className="table__body-row"
                                        key={item?.id}
                                    >
                                        <td className="table__body-item">
                                            {item?.user_name || "-"}
                                        </td>
                                        <td className="table__body-item">
                                            {item?.user_mobile}
                                            {item?.user_mobile && (
                                                <Link
                                                    href={`https://api.whatsapp.com/send?phone=${item.user_mobile}&text=${item.user_name} عزيز كلاس شما ${date} با استاد ${item?.teacher_name} تاييد شد`}
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
                                            {item?.payable
                                                ? `${Intl.NumberFormat().format(
                                                      item?.payable
                                                  )} تومان`
                                                : "-"}
                                        </td>
                                        <td className="table__body-item">
                                            {item?.status === 0 && (
                                                <span className="warning-color">
                                                    <b>در انتظار تایید</b>
                                                </span>
                                            )}
                                            {item?.status === 1 && (
                                                <span className="success-color">
                                                    <b>تایید شده</b>
                                                </span>
                                            )}
                                            {item?.status === 2 && (
                                                <span className="danger-color">
                                                    <b>کنسل</b>
                                                </span>
                                            )}
                                        </td>
                                        <td className="table__body-item table__body-item--rtl">
                                            {date}
                                        </td>
                                        <td className="table__body-item">
                                            <button
                                                className={`action-btn success`}
                                                onClick={() => {
                                                    setSelectedRequest(()=>{
                                                        return {
                                                        ...item,
                                                        index: i,
                                                    }});
                                                    setOpenModal(true);
                                                }}
                                            >
                                                جزئیات
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {classes?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={12}
                                    >
                                        کلاسی پیدا نشد
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

export default RequestDetails;
