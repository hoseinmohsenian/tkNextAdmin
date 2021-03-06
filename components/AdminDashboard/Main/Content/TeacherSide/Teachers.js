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
import ReactTooltip from 'react-tooltip';
import { AiOutlineInfoCircle, AiFillEye } from "react-icons/ai";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

const filtersSchema = { name: "", mobile: "", email: "" };
const appliedFiltersSchema = { name: false, mobile: false, email: false };
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

function Teachers({ fetchedTeachers: { data, ...restData }, token,searchData: fetchedData }) {
    const [teachers, setTeachers] = useState(data);
    const [formData, setFormData] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [filters, setFilters] = useState(fetchedData);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
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
                let message = `?????????? ${teachers[i].name} ${teachers[i].family} ${
                    status === 0 ? "????????" : "??????????????"
                } ????`;
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

    const readTeachers = async (page = 1, avoidFilters = false) => {
        let searchParams = {};

        const isFilterEnabled = (key) =>
            Number(filters[key]) !== 0 &&
            filters[key] !== undefined &&
            filters[key];
            
        // Constructing search parameters
        let searchQuery = "";
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };

            Object.keys(filters).forEach((key) => {
                if ((filters[key])) {
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

        if(!avoidFilters){
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
                let message = `?????????????? ???? ${e.target.value} ?????????? ??????`;
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
                showAlert(true, "success", e.target.value?"?????????????? ?????????? ????":"?????????????? ?????????????? ????");
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

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);        
        readTeachers(1, true);
        router.push({
            pathname: `/tkpanel/teachers`,
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
            <BreadCrumbs substituteObj={{ teachers: "??????????" }} />

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={changeStatus}
            />
            <Box
                title="???????? ????????????"
            >
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>???????????? ??????????</h3>
                        <div className={"modal__wrapper"}>                            
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ??????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTeacher?.email || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ??????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTeacher?.gender === 1 ? "??????" : "????"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTeacher?.step}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    ??????????
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedTeacher?.video ? "????????" : "??????????"}
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
                                        ?????? :
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
                                        ???????????? :
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
                                        ?????????? :
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
                                            ? "???? ?????? ?????????? ..."
                                            : "?????????? ??????????"}
                                    </button>
                                    {!showFilters() && (
                                        <button
                                            type="button"
                                            className={`btn danger-outline ${styles["btn"]}`}
                                            disabled={loading}
                                            onClick={() => removeFilters()}
                                        >
                                            {loading
                                                ? "???? ?????? ?????????? ..."
                                                : "?????? ??????????"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                
                <ReactTooltip className="tooltip" type="dark" />

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">??????</th>
                                <th className="table__head-item">?????? ????????????????</th>
                                <th className="table__head-item">????????</th>
                                <th className="table__head-item">?????????????? ??????????</th>
                                <th className="table__head-item">??????????????</th>
                                <th className="table__head-item">??????????????</th>
                                <th className="table__head-item">??????????????</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {teachers?.map((teacher, i) => (
                                <tr className="table__body-row" key={teacher?.id}>
                                    <td className="table__body-item">
                                        {teacher?.name}
                                    </td>
                                    <td className="table__body-item" data-tip={teacher?.mobile || "-"}>
                                        {teacher?.family}
                                        <span className="info-icon">
                                            <AiOutlineInfoCircle />
                                        </span>
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
                                                spellCheck={false}
                                                required
                                            />
                                        </div>
                                    </td>

                                    <td className="table__body-item" >
                                        <div style={{display:"flex"}}>
                                            <Link
                                                href={`${SITE_URL}/teachers/${teacher.id}`}
                                            >
                                                <a 
                                                    className={styles["profile-link"]} 
                                                    target="_blank"
                                                    title="?????????????? ??????????"
                                                >
                                                    <AiFillEye/>
                                                </a>
                                            </Link>

                                            <div 
                                                className={`${styles["status-circle"]} ${teacher.show === 1 ? "success" : "danger"}`} 
                                                data-tip={`?????????? ?????????? ???? ???????? ????????????:??? ${teacher.show === 1 ? "????????" : "??????????????"}`}
                                            ></div>
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
                                                ? "????????"
                                                : "?????? ????????"}
                                        </button>
                                        <Link
                                            href={`/dashboard/teacher/${teacher.id}?step=${teacher.step}`}
                                        >
                                            <a className={`action-btn primary`} target="_blank">
                                                ?????????? ???? ??????
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/multiSessionsList/logs/${teacher.id}?type=teacher`}
                                        >
                                            <a className={`action-btn warning`} target="_blank">
                                                ?????? ????????????
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/newTeacher/details/${teacher.id}`}
                                        >
                                            <a className={`action-btn primary`} target="_blank">
                                                ????????????
                                            </a>
                                        </Link>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedTeacher(teacher);
                                                setOpenModal(true);
                                            }}
                                        >
                                            ????????????
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {teachers.length === 0 && 
                                (  
                                    <tr className="table__body-row">
                                        <td className="table__body-item" colSpan={11}>
                                            ???????????? ???????? ??????
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
