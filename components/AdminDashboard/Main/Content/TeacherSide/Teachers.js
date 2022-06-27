import { useState } from "react";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import { useGlobalContext } from "../../../../../context";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import Box from "../Elements/Box/Box";
import styles from "./Teachers.module.css";
import Link from "next/link";
import Modal from "../../../../Modal/Modal";

function Teachers({ fetchedTeachers: { data, ...restData }, token,searchData: fetchedData }) {
    const [teachers, setTeachers] = useState(data);
    const [formData, setFormData] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [filters, setFilters] = useState(fetchedData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [loading, setLoading] = useState(false)
    const { generateKey } = useGlobalContext();
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState({});

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const changeStatus = async (teacher_id, status, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/status/${teacher_id}`,
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
                let message = `این کاربر ${
                    status === 0 ? "فعال" : "غیرفعال"
                } شد`;
                showAlert(true, status === 0 ? "success" : "danger", message);
                await readTeachers(pagData?.current_page);
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error changing status", error);
        }
    };

    const readTeachers = async (page = 1) => {
        let searchParams = {};

        const isFilterEnabled = (key) =>
            Number(filters[key]) !== 0 &&
            filters[key] !== undefined &&
            filters[key];
            
        // Constructing search parameters
        let searchQuery = "";
        Object.keys(filters).forEach((key) => {
            if (Number(filters[key]) !== 0) {
                if (key === "draft" && filters["draft"]) {
                    searchQuery += `draft=1&`;
                } else {
                    searchQuery += `${key}=${filters[key]}&`;
                }
            }
        });
        searchQuery += `page=${page}`;

        if (isFilterEnabled("name")) {
            searchParams = {
                ...searchParams,
                name: filters?.name,
            };
        }
        if (isFilterEnabled("email")) {
            searchParams = {
                ...searchParams,
                email: filters?.email,
            };
        }
        if (isFilterEnabled("mobile")) {
            searchParams = {
                ...searchParams,
                mobile: filters?.mobile,
            };
        }
        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/tkpanel/teachers`,
            query: searchParams,
        });

        try {
            setLoading(true)
            const res = await fetch(`${BASE_URL}/admin/teacher/search?${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const {
                data: { data, ...restData },
            } = await res.json();
            setTeachers(data);
            setFormData(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false)
        } catch (error) {
            console.log("Error reading teachers", error);
        }
    };

    const handleOnChange = (e, rowInd, name) => {
        let updated = [...formData];
        updated[rowInd] = { ...updated[rowInd], [name]: e.target.value };
        setFormData(() => updated);
    };

    const changeCommission = async (e, teacher_id, i) => {
        try {
            let temp = [...loadings];
            temp[i] = true;
            setLoadings(() => temp);

            const res = await fetch(
                `${BASE_URL}/admin/teacher/commission/${teacher_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ commission: e.target.value }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = `کمیسیون به ${e.target.value} تغییر کرد`;
                showAlert(true, "success", message);
            }

            temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error changing commission", error);
        }
    };

    const changeCommissionHandler = async (e, teacher_id, i) => {
        if (
            Number(e.target.value) !== teachers[i]?.commission &&
            e.target.value
        ) {
            await changeCommission(e, teacher_id, i);
            let temp = [...teachers];
            temp[i]?.commission = Number(e.target.value);
            setTeachers(() => temp);
        }
    };

    const addDesc = async (e, teacher_id, i) => {
        try {
            let temp = [...loadings];
            temp[i] = true;
            setLoadings(() => temp);

            const res = await fetch(
                `${BASE_URL}/admin/teacher/desc/${teacher_id}`,
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
                showAlert(true, "success", e.target.value?"توضیحات اضافه شد":"توضیحات برداشته شد");
            }

            temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error adding description", error);
        }
    };

    const addDescHandler = async (e, teacher_id, i) => {
        if (e.target.value !== teachers[i]?.admin_desc) {
            await addDesc(e, teacher_id, i);
            let temp = [...teachers];
            temp[i]?.admin_desc = (e.target.value);
            setTeachers(() => temp);
        }
    };

    const filtersOnChangeHandler = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
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
                title="لیست اساتید"
            >
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات استاد</h3>
                        <div className={"modal__wrapper"}>                            
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    وضعیت نمایش
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTeacher?.show ? "نمایان" : "پنهان‌"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    استپ
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTeacher?.step}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ویدئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTeacher?.video ? "دارد" : "ندارد"}
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
                                        htmlFor="name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        نام :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="form__input"
                                            onChange={filtersOnChangeHandler}
                                            value={filters?.name}
                                            autoComplete="off"
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
                                        htmlFor="mobile"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        موبایل :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="number"
                                            name="mobile"
                                            id="mobile"
                                            className="form__input"
                                            onChange={filtersOnChangeHandler}
                                            value={filters?.mobile}
                                            autoComplete="off"
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
                                        htmlFor="email"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        ایمیل :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="form__input"
                                            onChange={filtersOnChangeHandler}
                                            value={filters?.email}
                                            autoComplete="off"
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
                                        onClick={() => readTeachers()}
                                    >
                                        {loading
                                            ? "در حال جستجو ..."
                                            : "اعمال فیلتر"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام</th>
                                <th className="table__head-item">نام خانوادگی</th>
                                <th className="table__head-item">موبایل</th>
                                <th className="table__head-item">زبان</th>
                                <th className="table__head-item">توضیحات ادمین</th>
                                <th className="table__head-item">کمیسیون</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {teachers?.map((teacher, i) => (
                                <tr className="table__body-row" key={teacher?.id}>
                                    <td className="table__body-item">
                                        {teacher?.name}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.family}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.mobile || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.language_name?.map((lan, ind) => (
                                            <span
                                                key={generateKey(lan?.english_name)}
                                            >
                                                {lan?.persian_name}&nbsp;
                                                {ind !==
                                                    teacher?.language_name?.length -
                                                        1 && <span>&#8226;</span>}
                                                &nbsp;
                                            </span>
                                        ))}
                                        {teacher?.language_name?.length === 0 && (
                                            <span>-</span>
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        <div className="form-control" style={{width:"130px",margin:0}}>
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
                                                value={formData[i]?.admin_desc || ""}
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
                                        <div className="form-control" style={{width:"60px",margin:0}}>
                                            <input
                                                type="number"
                                                name="commission"
                                                id="commission"
                                                className="form__input"
                                                onChange={(e) =>
                                                    handleOnChange(
                                                        e,
                                                        i,
                                                        "commission"
                                                    )
                                                }
                                                value={formData[i]?.commission || ""}
                                                onBlur={(e) =>
                                                    changeCommissionHandler(
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
                                            className={`action-btn ${
                                                teacher?.status === 1
                                                    ?"danger"
                                                    : "success"
                                            }`}
                                            onClick={() =>
                                                changeStatus(
                                                    teacher?.id,
                                                    teacher?.status,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            {teacher?.status === 0
                                                ? "فعال"
                                                : "غیر فعال"}
                                        </button>
                                        <Link
                                            href={`/dashboard/teacher/${teacher.id}`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ورودی به پنل
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/multiSessionsList/logs/${teacher.id}?type=teacher`}
                                        >
                                            <a className={`action-btn warning`}>
                                                لاگ پیگیری
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/newTeacher/languagesPrice/${teacher.id}`}
                                        >
                                            <a className={`action-btn success`}>
                                                تغییر قیمت
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/newTeacher/details/${teacher.id}`}
                                        >
                                            <a className={`action-btn primary`}>
                                                مشخصات
                                            </a>
                                        </Link>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedTeacher(teacher);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {teachers.length === 0 && 
                                (  
                                    <tr className="table__body-row">
                                        <td className="table__body-item" colSpan={11}>
                                            استادی پیدا نشد
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </Box>

            {teachers.length !== 0 && (
                <Pagination read={readTeachers} pagData={pagData} />
            )}
        </div>
    );
}

export default Teachers;
