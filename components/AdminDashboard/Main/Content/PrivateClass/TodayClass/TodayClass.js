import { useState } from "react";
import styles from "./TodayClass.module.css";
import { BASE_URL } from "../../../../../../constants";
import Pagination from "../../Pagination/Pagination";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";
import { useRouter } from "next/router";
import { useGlobalContext } from "../../../../../../context";
import Modal from "../../../../../Modal/Modal";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Link from "next/link";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

const filtersSchema = {
    user_name: "",
    teacher_name: "",
    teacher_mobile: "",
    user_mobile: "",
    status: 0,
    first_class: false,
    pay: false,
};
const appliedFiltersSchema = {
    user_name: false,
    teacher_name: false,
    teacher_mobile: false,
    user_mobile: false,
    status: false,
    first_class: false,
    pay: false,
};

function TodayClass(props) {
    const {
        fetchedClasses: { data, ...restData },
        token,
        fetchedMeta,
    } = props;
    const [classes, setClasses] = useState(data);
    const [meta, setMeta] = useState(fetchedMeta);
    const [filters, setFilters] = useState(filtersSchema);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [pagData, setPagData] = useState(restData);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});
    const router = useRouter();
    moment.locale("fa", { useGregorianParser: true });
    const { formatTime } = useGlobalContext();

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    const readClasses = async (page = 1, avoidFilters = false) => {
        setLoading(true);

        let searchQuery = "";
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };
            Object.keys(filters).forEach((key) => {
                if (Number(filters[key]) !== 0) {
                    if (["first_class", "pay"].includes(key)) {
                        searchQuery += `${key}=${Number(filters[key])}&`;
                    } else {
                        searchQuery += `${key}=${filters[key]}&`;
                    }
                    tempFilters[key] = true;
                } else {
                    tempFilters[key] = false;
                }
            });

            setAppliedFilters(tempFilters);
        }
        searchQuery += `page=${page}`;

        let searchParams = {};
        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }
        router.push({
            pathname: `/tkpanel/class/requestDetails/today`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/classroom/today?${searchQuery}`,
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
                meta,
            } = await res.json();
            setClasses(data);
            setPagData(restData);
            setMeta(meta);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false);
        } catch (error) {
            console.log("Error reading classes", error);
        }
    };

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);
        readClasses(1, true);
        router.push({
            pathname: `/tkpanel/class/requestDetails/today`,
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
                substituteObj={{ class: "????????", today: "???????? ?????? ??????????" }}
            />

            <Box title="???????? ?????? ??????????">
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
                                    ???????????? ???????? ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.user_wallet
                                        ? `${Intl.NumberFormat().format(
                                              selectedClass?.user_wallet
                                          )} ??????????`
                                        : "-"}
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
                                    ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.language_name}
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
                                    {selectedClass.class_time
                                        ? `${selectedClass.class_time} ??????????`
                                        : "-"}
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
                                        htmlFor="user_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        ?????? ???????? ???????? :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="user_name"
                                            id="user_name"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.user_name}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="user_mobile"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        ?????????? ???????? ???????? :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="tel"
                                            name="user_mobile"
                                            id="user_mobile"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.user_mobile}
                                            maxLength={11}
                                            pattern="\d*"
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
                                        htmlFor="teacher_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        ?????? ?????????? :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="teacher_name"
                                            id="teacher_name"
                                            className="form__input"
                                            onChange={handleOnChange}
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
                                        ?????????? ?????????? :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="tel"
                                            name="teacher_mobile"
                                            id="teacher_mobile"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.teacher_mobile}
                                            maxLength={11}
                                            pattern="\d*"
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
                                    <div
                                        className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                    >
                                        <label
                                            htmlFor="first_class"
                                            className={`form__label ${styles["search-label"]}`}
                                        >
                                            ???????? ?????? :
                                        </label>
                                        <div className="form-control form-control-radio">
                                            <div className="input-radio-wrapper">
                                                <label
                                                    htmlFor="first_class"
                                                    className="radio-title"
                                                >
                                                    ???????? ??????
                                                </label>
                                                <input
                                                    type="checkbox"
                                                    name="first_class"
                                                    onChange={handleOnChange}
                                                    value={1}
                                                    checked={
                                                        Number(
                                                            filters.first_class
                                                        ) === 1
                                                    }
                                                    id="first_class"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="pay"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        ???????????? :
                                    </label>
                                    <div className="form-control form-control-radio">
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="pay"
                                                className="radio-title"
                                            >
                                                ???????????? ??????
                                            </label>
                                            <input
                                                type="checkbox"
                                                name="pay"
                                                onChange={handleOnChange}
                                                value={1}
                                                checked={
                                                    Number(filters.pay) === 1
                                                }
                                                id="pay"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`row ${styles["search-row"]}`}>
                            <div
                                className={`col-sm-12 ${styles["search-col"]}`}
                            >
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="status"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        ?????????? :
                                    </label>
                                    <div className="form-control form-control-radio">
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="canceled"
                                                className="radio-title"
                                            >
                                                ???????? ??????
                                            </label>
                                            <input
                                                type="radio"
                                                name="status"
                                                onChange={handleOnChange}
                                                value={2}
                                                checked={
                                                    Number(filters.status) === 2
                                                }
                                                id="canceled"
                                            />
                                        </div>
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="held"
                                                className="radio-title"
                                            >
                                                ???????????? ??????
                                            </label>
                                            <input
                                                type="radio"
                                                name="status"
                                                onChange={handleOnChange}
                                                value={1}
                                                checked={
                                                    Number(filters.status) === 1
                                                }
                                                id="held"
                                            />
                                        </div>
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="both"
                                                className="radio-title"
                                            >
                                                ????????
                                            </label>
                                            <input
                                                type="radio"
                                                name="status"
                                                onChange={handleOnChange}
                                                value={0}
                                                checked={
                                                    Number(filters.status) === 0
                                                }
                                                id="both"
                                            />
                                        </div>
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
                                {loading ? "???? ?????? ?????????? ..." : "?????????? ??????????"}
                            </button>
                            {!showFilters() && (
                                <button
                                    type="button"
                                    className={`btn danger-outline ${styles["btn"]}`}
                                    disabled={loading}
                                    onClick={() => removeFilters()}
                                >
                                    {loading ? "???? ?????? ?????????? ..." : "?????? ??????????"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {classes.length !== 0 && (
                    <div className="row">
                        <div className={`col-sm-6 col-lg-3 ${styles.card}`}>
                            <div className={styles.card__box}>
                                <span className={styles.card__title}>
                                    ?????????? ???????? ?????? ??????????
                                </span>
                                <span className={styles.card__number}>
                                    {meta.all_class}
                                </span>
                            </div>
                        </div>
                        <div className={`col-sm-6 col-lg-2 ${styles.card}`}>
                            <div className={styles.card__box}>
                                <span className={styles.card__title}>
                                    ???????? ????????
                                </span>
                                <span className={styles.card__number}>
                                    {meta.first_class}
                                </span>
                            </div>
                        </div>
                        <div className={`col-sm-6 col-lg-2 ${styles.card}`}>
                            <div className={styles.card__box}>
                                <span className={styles.card__title}>
                                    ???????????? ??????
                                </span>
                                <span className={styles.card__number}>
                                    {meta.held_class}
                                </span>
                            </div>
                        </div>
                        <div className={`col-sm-6 col-lg-2 ${styles.card}`}>
                            <div className={styles.card__box}>
                                <span className={styles.card__title}>
                                    ???????? ??????
                                </span>
                                <span className={styles.card__number}>
                                    {meta.cancel_class}
                                </span>
                            </div>
                        </div>
                        <div className={`col-sm-6 col-lg-3 ${styles.card}`}>
                            <div className={styles.card__box}>
                                <span className={styles.card__title}>
                                    ???????????? ????????
                                </span>
                                <span className={styles.card__number}>
                                    {meta.not_payed_class}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    ?????? ???????? ????????
                                </th>
                                <th className="table__head-item">
                                    ?????????? ???????? ????????
                                </th>
                                <th className="table__head-item">?????? ??????????</th>
                                <th className="table__head-item">?????????? ????????</th>
                                <th className="table__head-item">????????</th>
                                <th className="table__head-item">???????? ????????</th>
                                <th className="table__head-item">?????????? ????????</th>
                                <th className="table__head-item">??????????????</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {classes?.map((item) => (
                                <tr className="table__body-row" key={item?.id}>
                                    <td className="table__body-item">
                                        {item?.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.user_mobile}
                                        {item?.user_mobile && (
                                            <Link
                                                href={`https://api.whatsapp.com/send?phone=${item.user_mobile}`}
                                            >
                                                <a className="whatsapp-icon">
                                                    <span>
                                                        <AiOutlineWhatsApp />
                                                    </span>
                                                </a>
                                            </Link>
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.status === 0 &&
                                            "?????????? ?????????? ????????"}
                                        {item?.status === 1 && "???????????? ??????"}
                                        {item?.status === 2 && "???????? ??????"}
                                        {item?.status === 3 && "?????? ???????????? ??????"}
                                        {item?.status === 4 && "????????"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.price
                                            ? `${Intl.NumberFormat().format(
                                                  item?.price
                                              )} ??????????`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item.time && item.time !== "[]"
                                            ? formatTime(item.time)
                                            : "-"}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment(item?.date).format(
                                            "YYYY/MM/DD"
                                        )}
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
                                    </td>
                                </tr>
                            ))}

                            {classes?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={13}
                                    >
                                        ?????????? ???????? ??????
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

export default TodayClass;
