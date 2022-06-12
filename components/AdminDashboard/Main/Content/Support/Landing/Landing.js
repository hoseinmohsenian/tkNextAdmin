import { useState } from "react";
import styles from "./Landings.module.css";
import Alert from "../../../../../Alert/Alert";
import { BASE_URL } from "../../../../../../constants";
import Pagination from "../../Pagination/Pagination";
import Link from "next/link";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";
import Modal from "../../../../../Modal/Modal";

function Landing(props) {
    const {
        fetchedLandings: { data, ...restData },
        token,
    } = props;
    const [formData, setFormData] = useState(data);
    const [filters, setFilters] = useState({
        mobile: "",
        name: "",
        landing_name: "",
    });
    const [landings, setLandings] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [openModal, setOpenModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});
    moment.locale("fa", { useGregorianParser: true });

    const filtersOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

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

    const addDesc = async (e, landing_id, i) => {
        try {
            handleLoadings(i, true);

            const res = await fetch(
                `${BASE_URL}/admin/support/landing/user/${landing_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ admin_desc: e.target.value }),
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

    const addDescHandler = async (e, landing_id, i) => {
        if (e.target.value !== landings[i]?.admin_desc) {
            await addDesc(e, landing_id, i);
            let temp = [...landings];
            temp[i]?.admin_desc = (e.target.value);
            setLandings(() => temp);
        }
    };

    const changeStatus = async (landing_id, status, i) => {
        handleLoadings(i, true);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/support/landing/user/${landing_id}`,
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
                let message = `این لندینگ ${
                    status === 1 ? "فعال" : "غیرفعال"
                } شد`;
                showAlert(true, status === 1 ? "success" : "warning", message);
                let updated = [...landings];
                updated[i] = { ...updated[i], status: status === 0 ? 1 : 0 };
                setLandings(() => updated);
            }
            handleLoadings(i, false);
        } catch (error) {
            console.log("Error changing status", error);
        }
    };

    const readLandings = async (page = 1) => {
        setLoading(true);

        // Constructing search parameters
        let searchQuery = "";
        Object.keys(filters).forEach((key) => {
            if (Number(filters[key]) !== 0) {
                searchQuery += `${key}=${filters[key]}&`;
            }
        });
        searchQuery += `page=${page}`;

        try {
            const res = await fetch(
                `${BASE_URL}/admin/support/landing/all/user?${searchQuery}`,
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
            setLandings(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false);
        } catch (error) {
            console.log("Error reading landings", error);
        }
    };

    return (
        <div>
            <Box title="لندینگ تعاملی">
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات لندینگ</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    وضعیت کلاس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.status === 1 ? "فعال" : 'غیرفعال'}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    روز
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.day || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    URL
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.landing_url || "-"}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="mobile"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        موبایل :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="tel"
                                            name="mobile"
                                            id="mobile"
                                            className="form__input"
                                            onChange={filtersOnChange}
                                            value={filters?.mobile}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        نام :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="form__input"
                                            onChange={filtersOnChange}
                                            value={filters?.name}
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
                                        htmlFor="landing_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        نام لندینگ :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="landing_name"
                                            id="landing_name"
                                            className="form__input"
                                            onChange={filtersOnChange}
                                            value={filters?.landing_name}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className={styles["btn-wrapper"]}>
                                    <button
                                        type="button"
                                        className={`btn primary ${styles["btn"]}`}
                                        disabled={loading}
                                        onClick={() => readLandings()}
                                    >
                                        {loading ? "در حال انجام ..." : "جستجو"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

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
                                <th className="table__head-item">نام</th>
                                <th className="table__head-item">
                                    شماره موبایل
                                </th>
                                <th className="table__head-item">هدف</th>
                                <th className="table__head-item">زبان‌</th>
                                <th className="table__head-item">توضیحات ادمین</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {landings?.map((landing, i) => (
                                <tr
                                    className="table__body-row"
                                    key={landing?.id}
                                >
                                    <td className="table__body-item">
                                        {landing?.name}
                                    </td>
                                    <td className="table__body-item">
                                        {landing?.mobile}
                                    </td>
                                    <td
                                        className="table__body-item"
                                    >
                                        {landing?.purpose}
                                    </td>
                                    <td className="table__body-item">
                                        {landing?.language_name}
                                    </td>
                                    <td className="table__body-item">
                                        <div
                                            className="form-control"
                                            style={{
                                                width: "130px",
                                                margin: 0,
                                            }}
                                        >
                                            <input
                                                type="text"
                                                name="admin_desc"
                                                id="admin_desc"
                                                className="form__input"
                                                onChange={(e) =>
                                                    handleOnChange(
                                                        e,
                                                        i,
                                                        "admin_desc"
                                                    )
                                                }
                                                value={
                                                    formData[i]?.admin_desc ||
                                                    ""
                                                }
                                                onBlur={(e) =>
                                                    addDescHandler(
                                                        e,
                                                        teacher?.id,
                                                        i
                                                    )
                                                }
                                                disabled={loadings[i]}
                                                autoComplete="off"
                                                spellCheck={false}
                                                required
                                            />
                                        </div>
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() =>
                                                deleteArticle(landing?.id, i)
                                            }
                                            disabled={loadings[i]}
                                        >
                                            حذف
                                        </button>
                                        <Link
                                            href={`/tkpanel/siteNews/${landing?.id}/edit`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش &nbsp;
                                            </a>
                                        </Link>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedClass(landing);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                        <Link
                                            href={`https://barmansms.ir/blog${landing?.url}`}
                                            disabled={loadings[i]}
                                        >
                                            <a className={`action-btn primary`}>
                                                نمایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                landing?.draft === 1
                                                    ? "success"
                                                    : "warning"
                                            }`}
                                            onClick={() =>
                                                changeStatus(
                                                    landing?.id,
                                                    landing?.draft,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            {landing?.draft === 0
                                                ? "پیش نویس"
                                                : "منتشر"}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {landings?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={10}
                                    >
                                        لندینگی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {landings.length !== 0 && (
                    <Pagination read={readLandings} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default Landing;
