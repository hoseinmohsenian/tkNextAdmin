import { useState } from "react";
import Link from "next/link";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import Alert from "../../../../Alert/Alert";
import Modal from "../../../../Modal/Modal";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";
import DeleteModal from "../../../../DeleteModal/DeleteModal";
import styles from "./SemiPrivate.module.css";

const filtersSchema = { teacher_name: "", language_id: "" };
const appliedFiltersSchema = { teacher_name: false, language_id: false };

function SemiPrivate(props) {
    const {
        fetchedClasses: { data, ...restData },
        token,
        languages,
        searchData,
    } = props;
    const [classes, setClasses] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();
    const [filters, setFilters] = useState(searchData);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [openModal, setOpenModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState({});
    const [dModalVisible, setDModalVisible] = useState(false);
    moment.locale("fa", { useGregorianParser: true });
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const readClasses = async (page = 1, avoidFilters = false) => {
        setLoading(true);

        // Constructing search parameters
        let searchQuery = "";
        let searchParams = {};
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };

            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    searchQuery += `${key}=${filters[key]}&`;
                    tempFilters[key] = true;
                    searchParams = {
                        ...searchParams,
                        [key]: filters[key],
                    };
                } else {
                    tempFilters[key] = false;
                }
            });

            setAppliedFilters(tempFilters);
        }
        searchQuery += `page=${page}`;

        router.push({
            pathname: `/tkpanel/semi-private-admin`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/semi-private?${searchQuery}`,
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
            console.log("Error reading semi-private classes", error);
        }
        setLoading(false);
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const changeStatus = async (class_id, status, i) => {
        loadingHandler(i, true);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/semi-private/${class_id}`,
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
                showAlert(true, status === 0 ? "success" : "danger", message);
                let updated = [...classes];
                updated[i] = { ...updated[i], status: status === 0 ? 1 : 0 };
                setClasses(() => updated);
                setDModalVisible(false);
            }
            loadingHandler(i, false);
        } catch (error) {
            console.log("Error changing status", error);
        }
    };

    const loadingHandler = (ind, value) => {
        let temp = [...loadings];
        temp[ind] = value;
        setLoadings(() => temp);
    };

    const readClassStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/semi-private/student/${selectedClass.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const { data } = await res.json();
                setSelectedClass({ ...selectedClass, students: data });
            }
        } catch (error) {
            console.log("Error reading class students", error);
        }
        setLoading(false);
    };

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);
        readClasses(1, true);
        router.push({
            pathname: `/tkpanel/semi-private-admin`,
            query: {},
        });
    };

    const showFilters = () => {
        let values = Object.values(appliedFilters);
        for (let i = 0; i < values.length; i++) {
            let value = values[i];
            if (value) {
                return true;
            }
        }
        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await readClasses();
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={changeStatus}
            />

            <BreadCrumbs
                substituteObj={{
                    "semi-private-admin": "کلاس نیمه خصوصی",
                }}
            />

            <DeleteModal
                visible={dModalVisible}
                setVisible={setDModalVisible}
                title="تغییر وضعیت کلاس"
                bodyDesc={`شما در حال ${
                    selectedClass.status === 1 ? "غیرفعال" : "فعال"
                } سازی کلاس «${selectedClass.title}» هستید؛ آیا اطمینان دارید؟`}
                handleOk={() => {
                    changeStatus(
                        selectedClass?.id,
                        selectedClass?.status,
                        selectedClass.index
                    );
                }}
                confirmLoading={loadings[selectedClass.index]}
            />

            <Box
                title="لیست کلاس های نیمه خصوصی"
                buttonInfo={{
                    name: "ایجاد کلاس نیمه خصوصی",
                    url: "/tkpanel/semi-private-admin/create",
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
                                    وضعیت برگزاری
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass.finished === 1
                                        ? "پایان یافته"
                                        : "درحال برگزاری"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    وضعیت کلاس
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.status === 0 &&
                                        "تعیین وضعیت نشده"}
                                    {selectedClass?.status === 1 &&
                                        "برگزار شده"}
                                    {selectedClass?.status === 2 && "کنسل شده"}
                                    {selectedClass?.status === 3 &&
                                        "لغو بازگشت پول"}
                                    {selectedClass?.status === 4 && "غیبت"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    تعداد جلسات
                                </span>
                                <span className={"modal__item-body"}>
                                    {`${selectedClass.session_number} جلسه`}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    جلسات برگزار شده
                                </span>
                                <span className={"modal__item-body"}>
                                    {`${selectedClass.held_session} جلسه`}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    تعداد زبان آموزان
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedClass?.student_number
                                        ? `${selectedClass.student_number} نفر`
                                        : "-"}

                                    {!selectedClass.students && (
                                        <button
                                            type="button"
                                            onClick={readClassStudents}
                                            className={`action-btn primary-outline`}
                                            style={{
                                                marginRight: 10,
                                            }}
                                            disabled={loading}
                                        >
                                            نمایش زبان آموزان
                                        </button>
                                    )}

                                    {selectedClass.students && (
                                        <ul
                                            style={{
                                                marginTop: 10,
                                                listStyleType: "disc",
                                            }}
                                        >
                                            {selectedClass.students?.map(
                                                (std) => (
                                                    <li key={std.id}>
                                                        {std.name_family} -{" "}
                                                        {std.mobile}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className={styles["search"]}>
                    <form
                        className={styles["search-wrapper"]}
                        onSubmit={handleSubmit}
                    >
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="teacher_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        استاد :
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
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="language_id"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        زبان :
                                    </label>
                                    <div className="form-control">
                                        <select
                                            name="language_id"
                                            id="language_id"
                                            className="form__input input-select"
                                            onChange={handleOnChange}
                                            value={filters.language_id}
                                        >
                                            <option value={0}>
                                                انتخاب کنید
                                            </option>
                                            {languages?.map((lan) => (
                                                <option
                                                    key={lan?.id}
                                                    value={lan?.id}
                                                >
                                                    {lan?.persian_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles["btn-wrapper"]}>
                            <button
                                type="submit"
                                className={`btn primary ${styles["btn"]}`}
                                disabled={loading}
                            >
                                {loading ? "در حال انجام ..." : "اعمال فیلتر"}
                            </button>
                            {showFilters() && (
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
                                <th className="table__head-item">قیمت</th>
                                <th className="table__head-item">
                                    تاریخ ایجاد
                                </th>
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
                                    <td className="table__body-item">
                                        {cls.price
                                            ? `${Intl.NumberFormat().format(
                                                  cls.price
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment
                                            .from(
                                                cls.created_at,
                                                "en",
                                                "YYYY/MM/DD hh:mm:ss"
                                            )
                                            .locale("fa")
                                            .format("YYYY/MM/DD hh:mm:ss")}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/semi-private-admin/${cls?.id}/edit`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/semi-private-admin/${cls?.id}/sessions`}
                                        >
                                            <a
                                                className={`action-btn warning`}
                                                target="_blank"
                                            >
                                                جلسات
                                            </a>
                                        </Link>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedClass(cls);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                cls?.status === 1
                                                    ? "danger"
                                                    : "success"
                                            }`}
                                            onClick={() => {
                                                setSelectedClass({
                                                    ...cls,
                                                    index: i,
                                                });
                                                setDModalVisible(true);
                                            }}
                                            disabled={loadings[i]}
                                        >
                                            {cls?.status === 1
                                                ? "غیرفعال"
                                                : "فعال"}
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

export default SemiPrivate;
