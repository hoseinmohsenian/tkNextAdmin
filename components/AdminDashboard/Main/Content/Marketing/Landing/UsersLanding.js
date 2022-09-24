import { useState } from "react";
import styles from "./Landings.module.css";
import Alert from "../../../../../Alert/Alert";
import Pagination from "../../Pagination/Pagination";
import Link from "next/link";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";
import { AiOutlineWhatsApp, AiFillEye } from "react-icons/ai"
import { useRouter } from "next/router";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";
import Modal from "../../../../../Modal/Modal";

const filtersSchema = {
    mobile: "",
    name: "",
    landing_name: "",
};
const appliedFiltersSchema ={
    mobile: false,
    name: false,
    landing_name: false,
};

function UsersLanding(props) {
    const {
        fetchedLandings: { data, ...restData },
        token,
    } = props;
    const [formData, setFormData] = useState(data);
    const [filters, setFilters] = useState(filtersSchema);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [landings, setLandings] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const router= useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [selectedLanding, setSelectedLanding] = useState({});
    moment.locale("fa", { useGregorianParser: true });
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
                let message = "این لندینگ انجام شد";
                showAlert(true, "success", message);
                let updated = [...landings];
                updated[i] = { ...updated[i], status: status === 0 ? 1 : 0 };
                setLandings(() => updated);
            }
            handleLoadings(i, false);
        } catch (error) {
            console.log("Error changing status", error);
        }
    };

    const readLandings = async (page = 1, avoidFilters = false) => {
        setLoading(true);

        // Constructing search parameters
        let searchQuery = "";
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };

            Object.keys(filters).forEach((key) => {
                if (Number(filters[key]) !== 0) {
                    searchQuery += `${key}=${filters[key]}&`;
                    tempFilters[key] = true;
                    }
                    else{
                        tempFilters[key] = false;
                    }
            });

            setAppliedFilters(tempFilters);
        }
        searchQuery += `page=${page}`;

        router.push({
            pathname: `/tkpanel/landing/users/list`,
            query: { page },
        });

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

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);        
        readLandings(1, true);
        router.push({
            pathname: `/tkpanel/landing/users/list`,
            query: {},
        });
    };

    const showFilters = () => {
        let values = Object.values(appliedFilters);
        for (let i = 0; i < values.length; i++) {
            let value = values[i];
            if (value) {
                return false;
            }
        }
        return true;
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    landing: "لندینگ",
                    users: "لندینگ تعاملی کاربران",
                    list: "لیست",
                }}
            />

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
                            <span className={"modal__item-title"}>توضیحات ادمین</span>
                            <span className={"modal__item-body"}>
                                {selectedLanding.admin_desc || "-"}
                            </span>
                        </div>
                    </div>
                </Modal>
            )}

            <Box title="لندینگ تعاملی کاربران">
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
                                    {!showFilters() && (
                                        <button
                                            type="button"
                                            className={`btn danger-outline ${styles["btn"]}`}
                                            disabled={loading}
                                            onClick={() => removeFilters()}
                                        >
                                            {loading
                                                ? "در حال انجام ..."
                                                : "حذف فیلتر"}
                                        </button>
                                    )}
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
                                <th className="table__head-item">نام لندینگ</th>
                                <th className="table__head-item">توضیحات ادمین</th>
                                <th className="table__head-item">روز</th>
                                <th className="table__head-item">وضعیت</th>
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
                                        {landing.mobile}
                                        <Link
                                            href={`https://api.whatsapp.com/send?phone=${landing.mobile}&text=%D8%B3%D9%84%D8%A7%D9%85%20%20%D8%B9%D8%B2%DB%8C%D8%B2%0A%D8%A7%D9%81%D8%B4%D8%A7%D8%B1%DB%8C%20%D9%87%D8%B3%D8%AA%D9%85%20%D8%A7%D8%B2%20%D8%B3%D8%A7%D9%85%D8%A7%D9%86%D9%87%20%D8%A2%D9%85%D9%88%D8%B2%D8%B4%20%D8%B2%D8%A8%D8%A7%D9%86%20%D8%AA%DB%8C%DA%A9%D8%A7%0A%D9%84%D8%B7%D9%81%D8%A7%D9%8B%20%D8%A8%D8%B1%D8%A7%DB%8C%20%D8%A7%D8%B3%D8%AA%D9%81%D8%A7%D8%AF%D9%87%20%D8%A7%D8%B2%20%DA%A9%D9%84%D8%A7%D8%B3%D8%8C%20%D8%B2%D9%85%D8%A7%D9%86%20%D8%A2%D8%B2%D8%A7%D8%AF%20%D8%AE%D9%88%D8%AF%D8%AA%D9%88%D9%86%20%D8%B1%D9%88%20%D8%A8%D8%B1%D8%A7%DB%8C%20%D9%85%D8%A7%20%D8%A7%D8%B1%D8%B3%D8%A7%D9%84%20%DA%A9%D9%86%DB%8C%D8%AF%F0%9F%99%8F%0A%0Ahttps://tikkaa.ir%0A%0A%D8%A7%D8%B1%D8%AA%D8%A8%D8%A7%D8%B7%20%D8%A8%D8%A7%20%D9%BE%D8%B4%D8%AA%DB%8C%D8%A8%D8%A7%D9%86%DB%8C%F0%9F%8C%B8%0A%D9%88%D8%A7%D8%AA%D8%B3%20%D8%A7%D9%BE:%20%0A0922-323-1936%0A%DB%8C%D8%A7%0A%D8%AA%D9%85%D8%A7%D8%B3%20:%0A021-91016620`}
                                        >
                                            <a className="whatsapp-icon" target="_blank">
                                                <span>
                                                    <AiOutlineWhatsApp />
                                                </span>                                                
                                            </a>
                                        </Link>
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
                                        {landing?.landing_title || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <div style={{ display:"flex", alignItems: "center" }}>
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
                                                            landing?.id,
                                                            i
                                                        )
                                                    }
                                                    disabled={loadings[i]}
                                                    autoComplete="off"
                                                    spellCheck={false}
                                                    required
                                                />
                                            </div>
                                            <button 
                                                className="primary-color" 
                                                style={{ 
                                                    cursor:"pointer", 
                                                    marginRight:5,
                                                    display: "flex"
                                                }}
                                                onClick={() => {
                                                    setSelectedLanding(landing);
                                                    setOpenModal(true);
                                                }}
                                                title="نمایش کامل"
                                            >
                                                <AiFillEye fontSize={20} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="table__body-item">
                                        {landing?.day === null && "-"}
                                        {landing?.day === 0 && "هرروز هفته"}
                                        {landing?.day === 1 && "شنبه"}
                                        {landing?.day === 2 && "۱ شنبه"}
                                        {landing?.day === 3 && "۲ شنبه"}
                                        {landing?.day === 4 && "۳ شنبه"}
                                        {landing?.day === 5 && "۴ شنبه"}
                                        {landing?.day === 6 && "۵ شنبه"}
                                        {landing?.day === 7 && "جمعه"}
                                    </td>
                                    <td className="table__body-item">
                                        {landing?.status === 1 ? "انجام شده" : <span className="danger">انجام نشده</span>}  
                                    </td>
                                    <td className="table__body-item">
                                        {landing.status === 0 ?
                                            <button
                                                type="button"
                                                className={`action-btn success`}
                                                onClick={() =>
                                                    changeStatus(
                                                        landing?.id,
                                                        landing?.status,
                                                        i
                                                    )
                                                }
                                                disabled={loadings[i]}
                                            >
                                                انجام شد
                                            </button> : "-"}
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

export default UsersLanding;








