import { useState } from "react";
import Link from "next/link";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import Modal from "../../../../Modal/Modal";
import styles from "./GroupClass.module.css";

const filtersSchema = {
    teacher_name: "",
    title: "",
    status: -1,
};
const appliedFiltersSchema = {
    teacher_name: false,
    title: false,
    status: false,
};

function GroupClass(props) {
    const {
        fetchedClasses: { data, ...restData },
        token,
        searchData,
    } = props;
    const [classes, setClasses] = useState(data);
    const [filters, setFilters] = useState({ ...filtersSchema, ...searchData });
    const [appliedFilters, setAppliedFilters] = useState({
        ...filtersSchema,
        ...searchData,
    });
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [openModal, setOpenModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});
    moment.locale("fa", { useGregorianParser: true });

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
                    console.log("key", key);
                    searchParams = {
                        ...searchParams,
                        [key]: filters[key],
                    };
                    tempFilters[key] = true;
                    searchQuery += `${key}=${filters[key]}&`;
                } else {
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
            pathname: `/tkpanel/groupClass`,
            query: searchParams,
        });

        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/group-class?${searchQuery}`,
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
            console.log("Error reading group-classes", error);
        }
        setLoading(false);
    };
    console.log(filters);
    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const changeStatus = async (class_id, status, i) => {
        loadingHandler(i, true);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/group-class/${class_id}`,
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
                let message = `این کلاس ${
                    status === 0 ? "فعال" : "غیرفعال"
                } شد`;
                showAlert(true, status === 0 ? "success" : "warning", message);
                let updated = [...classes];
                updated[i] = { ...updated[i], status: status === 0 ? 1 : 0 };
                setClasses(() => updated);
            }
            loadingHandler(i, false);
        } catch (error) {
            console.log("Error changing status", error);
        }
    };

    const changeShow = async (class_id, show, i) => {
        loadingHandler(i, true);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/group-class/${class_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ show: show === 0 ? 1 : 0 }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = `این کلاس ${show === 0 ? "نمایان" : "پنهان"} شد`;
                showAlert(true, show === 0 ? "success" : "warning", message);
                let updated = [...classes];
                updated[i] = { ...updated[i], show: show === 0 ? 1 : 0 };
                setClasses(() => updated);
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

    const showFilters = () => {
        const keys = Object.keys(appliedFilters);
        const values = Object.values(appliedFilters);
        for (let i = 0; i < values.length; i++) {
            let value = values[i],
                key = keys[i];
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
            pathname: `/tkpanel/groupClass`,
            query: {},
        });
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={changeStatus}
            />

            <Box
                title="لیست کلاس های گروهی"
                buttonInfo={{
                    name: "ایجاد کلاس گروهی",
                    url: "/tkpanel/groupClass/create",
                    color: "primary",
                }}
            >
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات کلاس‌‌</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ظرفیت
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.class_capacity} نفر
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    مدت کلاس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass.session_time
                                        ? `${selectedClass.session_time} دقیقه`
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
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="title"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        عنوان :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            className="form__input"
                                            onChange={handleFilterOnChange}
                                            value={filters?.title}
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
                                        وضعیت :
                                    </label>
                                    <div className="form-control form-control-radio">
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="active"
                                                className="radio-title"
                                            >
                                                فعال
                                            </label>
                                            <input
                                                type="radio"
                                                name="status"
                                                onChange={handleFilterOnChange}
                                                value={1}
                                                checked={
                                                    Number(filters.status) === 1
                                                }
                                                id="active"
                                            />
                                        </div>
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="inactive"
                                                className="radio-title"
                                            >
                                                غیرفعال
                                            </label>
                                            <input
                                                type="radio"
                                                name="status"
                                                onChange={handleFilterOnChange}
                                                value={0}
                                                checked={
                                                    Number(filters.status) === 0
                                                }
                                                id="inactive"
                                            />
                                        </div>
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="both"
                                                className="radio-title"
                                            >
                                                هردو
                                            </label>
                                            <input
                                                type="radio"
                                                name="status"
                                                onChange={handleFilterOnChange}
                                                value={-1}
                                                checked={
                                                    Number(filters.status) ===
                                                    -1
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
                                <th className="table__head-item">عنوان</th>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">زبان‌</th>
                                <th className="table__head-item">کمیسیون</th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">تاریخ شروع</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {classes?.map((cls, i) => (
                                <tr className="table__body-row" key={cls.id}>
                                    <td className="table__body-item">
                                        {cls.title}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.language_name}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {cls.commission}%
                                    </td>
                                    <td className="table__body-item">
                                        {cls.status === 0 && "غیرفعال"}
                                        {cls.status === 1 && "فعال"}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {cls.start_date
                                            ? moment
                                                  .from(
                                                      cls.start_date
                                                          .replace("-", "/")
                                                          .replace("-", "/"),
                                                      "en",
                                                      "YYYY/MM/DD"
                                                  )
                                                  .locale("fa")
                                                  .format("YYYY/MM/DD")
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/groupClass/${cls?.id}/edit`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                cls?.status === 1
                                                    ? "danger"
                                                    : "success"
                                            }`}
                                            onClick={() =>
                                                changeStatus(
                                                    cls?.id,
                                                    cls?.status,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            {cls?.status === 1
                                                ? "غیرفعال"
                                                : "فعال"}
                                        </button>
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                cls?.show === 1
                                                    ? "danger"
                                                    : "success"
                                            }`}
                                            onClick={() =>
                                                changeShow(
                                                    cls?.id,
                                                    cls?.show,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            {cls?.show === 1
                                                ? "پنهان"
                                                : "نمایش"}
                                        </button>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedClass(cls);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {classes.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={12}
                                    >
                                        کلاسی پیدا نشد.
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

export default GroupClass;
