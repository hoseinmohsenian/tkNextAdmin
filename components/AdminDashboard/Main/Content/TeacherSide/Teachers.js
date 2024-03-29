import { useState } from "react";
import Alert from "../../../../Alert/Alert";
import { useGlobalContext } from "../../../../../context";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import Box from "../Elements/Box/Box";
import styles from "./Teachers.module.css";
import Link from "next/link";
import Modal from "../../../../Modal/Modal";
import { Tooltip } from "antd";
import { AiFillEye } from "react-icons/ai";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";
import DeleteModal from "../../../../DeleteModal/DeleteModal";
import TeacherMobileTooltip from "../../../../TeacherMobileTooltip/TeacherMobileTooltip";

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
    const [dModalVisible, setDModalVisible] = useState(false);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
                let message = `استاد ${teachers[i].name} ${teachers[i].family} ${
                    status === 0 ? "فعال" : "غیرفعال"
                } شد`;
                showAlert(true, status === 0 ? "success" : "danger", message);
                setDModalVisible(false);
                await readTeachers(pagData?.current_page);
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error changing status", error);
        }
    };

    const changeShow = async (teacher_id, show, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/show/${teacher_id}`,
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
                let message = `استاد ${teachers[i].name} ${teachers[i].family} در لیست اساتید ${
                    show === 0 ? "فعال" : "غیرفعال"
                } شد`;
                showAlert(true, show === 0 ? "success" : "danger", message);
                setDModalVisible(false);
                await readTeachers(pagData?.current_page);
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error changing show", error);
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
            if(pagData?.current_page !== page){
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        await readTeachers();
    }

    const handleURLOnChange = (e, i) => {
        let updatedItem = { ...teachers[i], ...selectedTeacher, url: e.target.value };
        setSelectedTeacher(updatedItem);
    };

    const changeURL = async (i) => {
        try {
            let temp = [...loadings];
            temp[i] = true;
            setLoadings(() => temp);

            const res = await fetch(
                `${BASE_URL}/admin/teacher/url/${selectedTeacher.id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ url: selectedTeacher.url }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(true, "success", `URL استاد ${selectedTeacher.family} باموفقیت ویرایش شد`);

                // Updating the teachers list
                let updatedList = [...teachers];
                updatedList[i].url = selectedTeacher.url;
                setTeachers(() => updatedList);
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }

            temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error changing teacher URL", error);
        }
    };

    const changeURLHandler = async (i) => {
        if (
            selectedTeacher.url !== teachers[i]?.url 
        ) {
            await changeURL(i);
        }
    };

    return (
        <div>
            <BreadCrumbs substituteObj={{ teachers: "استاد" }} />

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={changeStatus}
            />

            <DeleteModal
                visible={dModalVisible}
                setVisible={setDModalVisible}
                title={selectedTeacher.modalTitle}
                bodyDesc={selectedTeacher.modalDesc}
                handleOk={selectedTeacher.onClick}
                confirmLoading={loadings[selectedTeacher.index]}
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
                            {selectedTeacher.showDesc ? (
                                <div className={"modal__item"}>
                                    <span className={"modal__item-title"}>
                                        توضیحات ادمین
                                    </span>
                                    <span className={"modal__item-body"}>
                                        {selectedTeacher?.admin_desc || "-"}
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <div className={"modal__item"}>
                                        <span className={"modal__item-title"}>
                                            ایمیل
                                        </span>
                                        <span className={"modal__item-body"}>
                                            {selectedTeacher?.email || "-"}
                                        </span>
                                    </div>
                                    <div className={"modal__item"}>
                                        <span className={"modal__item-title"}>
                                            جنسیت
                                        </span>
                                        <span className={"modal__item-body"}>
                                            {selectedTeacher?.gender === 1 ? "مرد" : "زن"}
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
                                    <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    URL
                                </span>
                                <span
                                    className={"modal__item-body"}
                                    style={{ display: "flex", width: '100%' }}
                                >
                                    <div
                                        className="form-control"
                                        style={{ margin: 0, width: '100%' }}
                                    >
                                        <input
                                            type="text"
                                            name="url"
                                            id="url"
                                            className="form__input"
                                            onChange={(e) =>
                                                handleURLOnChange(
                                                    e,
                                                    selectedTeacher.index
                                                )
                                            }
                                            value={selectedTeacher?.url || ""}
                                            spellCheck={false}
                                        />
                                    </div>
                                    <button
                                        className={`action-btn primary`}
                                        onClick={() => changeURLHandler(selectedTeacher.index)}
                                        disabled={loading}
                                    >
                                        ثبت
                                    </button>
                                </span>
                            </div>
                                </>
                            )}
                        </div>
                    </Modal>
                )}

                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]} onSubmit={handleSubmit}>
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
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className={styles["btn-wrapper"]}>
                                    <button
                                        type="submit"
                                        className={`btn primary ${styles["btn"]}`}
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "در حال جستجو ..."
                                            : "اعمال فیلتر"}
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

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">ID</th>
                                <th className="table__head-item">نام</th>
                                <th className="table__head-item">نام خانوادگی</th>
                                <th className="table__head-item">زبان</th>
                                <th className="table__head-item">توضیحات ادمین</th>
                                <th className="table__head-item">کمیسیون</th>
                                <th className="table__head-item">پروفایل</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {teachers?.map((teacher, i) => (
                                <tr className="table__body-row" key={teacher.id}>
                                    <td className="table__body-item">
                                        {teacher.id}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher.name}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher.family}
                                        <TeacherMobileTooltip
                                            mobile={teacher.mobile}
                                        />
                                    </td>
                                    <td className="table__body-item">
                                        {teacher.language_name?.map((lan, ind) => (
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
                                        {teacher.language_name?.length === 0 && (
                                            <span>-</span>
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        <div style={{ display:"flex", alignItems: "center" }}>
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
                                                    style={{fontSize: 13}}
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
                                                    setSelectedTeacher({
                                                        admin_desc: formData[i]?.admin_desc,
                                                        showDesc: true
                                                    });
                                                    setOpenModal(true);
                                                }}
                                                title="نمایش کامل"
                                            >
                                                <AiFillEye fontSize={20} />
                                            </button>
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
                                                href={`${SITE_URL}/teachers/${teacher.url}`}
                                            >
                                                <a 
                                                    className={styles["profile-link"]} 
                                                    target="_blank"
                                                    title="پروفایل استاد"
                                                >
                                                    <AiFillEye/>
                                                </a>
                                            </Link>

                                            <Tooltip 
                                                title={`وضعیت نمایش در لیست اساتید:‌ ${teacher.show === 1 ? "فعال" : "غیرفعال"}`}
                                                overlayStyle={{fontSize:12}}
                                            >
                                                <div 
                                                    className={`${styles["status-circle"]} ${teacher.show === 1 ? "success" : "danger"}`} 
                                                    onClick={() => {
                                                        setSelectedTeacher({
                                                            ...teacher,
                                                            index: i,
                                                            modalTitle: "تغییر وضعیت نمایش استاد",
                                                            modalDesc: `آیا از تغییر وضعیت نمایش استاد «${teacher.name + " " + teacher.family}» اطمینان دارید؟`,
                                                            onClick: () => {
                                                                changeShow(
                                                                    teacher.id,
                                                                    teacher.show,
                                                                    i
                                                                )               
                                                            }
                                                        });
                                                        setDModalVisible(true);
                                                    }}
                                                    disabled={loadings[i]}
                                                ></div>
                                            </Tooltip>
                                        </div>
                                    </td>

                                    <td className="table__body-item">
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                teacher.status === 0
                                                    ? "danger"
                                                    : "success"
                                            }`}
                                            onClick={() => {
                                                setSelectedTeacher({
                                                    ...teacher,
                                                    index: i,
                                                    modalTitle: "فعال و غیرفعال کردن استاد",
                                                    modalDesc: `شما در حال ${teacher.status === 1 ? 'غیرفعال' : 'فعال' } سازی استاد «${teacher.name + " " + teacher.family}» هستید؛ آیا اطمینان دارید؟`,
                                                    onClick: () => {
                                                        changeStatus(
                                                            teacher.id,
                                                            teacher.status,
                                                            i
                                                        )
                                                    }
                                                });
                                                setDModalVisible(true);
                                            }}
                                            disabled={loadings[i]}
                                        >
                                            {teacher.status === 1
                                                ? "فعال"
                                                : "غیر فعال"}
                                        </button>
                                        <Link
                                            href={`/dashboard/teacher/${teacher.id}?step=${teacher.step}`}
                                        >
                                            <a className={`action-btn primary`} target="_blank">
                                                {"ورود به پنل "}
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/multiSessionsList/logs/${teacher.id}?type=teacher`}
                                        >
                                            <a className={`action-btn warning`} target="_blank">
                                                لاگ پیگیری&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/tkpanel/newTeacher/details/${teacher.id}`}
                                        >
                                            <a className={`action-btn primary`} target="_blank">
                                                مشخصات
                                            </a>
                                        </Link>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedTeacher({...teacher, index: i});
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
