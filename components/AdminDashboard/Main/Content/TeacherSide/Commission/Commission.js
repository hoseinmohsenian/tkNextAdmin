import { useState } from "react";
import Alert from "../../../../../Alert/Alert";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";
import Box from "../../Elements/Box/Box";
import Modal from "../../../../../Modal/Modal";
import AddCommission from "./AddCommission/AddCommission";
import moment from "jalali-moment";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";
import styles from "../Teachers.module.css";

const filtersSchema = { user_name:'',teacher_name:'' };
const appliedFiltersSchema = { user_name:false,teacher_name:false };

function Commission({ fetchedCommissions: { data, ...restData }, token, searchData }) {
    const [commissions, setCommissions] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [formData, setFormData] = useState(data);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState(searchData);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const removeCommissionFromList = (commission_id) => {
        let filteredItems = commissions.filter((cms) => cms.id !== commission_id)
        setCommissions(() => filteredItems);
        setFormData(() => filteredItems);
    };
    
    const deleteCommission = async (commission_id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/changeable/commission/${commission_id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = "این کمیسیون حذف شد";
                showAlert(true, "danger", message);
                removeCommissionFromList(commission_id);
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting commission", error);
        }
    };

    const readCommissions = async (page = 1, avoidFilters = false) => {
        setLoading(true);
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
                    searchParams ={ ...searchParams, [key]:filters[key] }
                }
                else{
                    tempFilters[key] = false;
                }
            });

            setAppliedFilters(tempFilters);
        }
        searchQuery += `page=${page}`;

        router.push({
            pathname: `/tkpanel/teacher/commission`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/changeable/commission?${searchQuery}`,
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
            setFormData(data);
            setCommissions(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading commissions", error);
        }
        setLoading(false);
    };

    const changeCommission = async (e, id, i) => {
        try {
            let temp = [...loadings];
            temp[i] = true;
            setLoadings(() => temp);

            const res = await fetch(
                `${BASE_URL}/admin/teacher/changeable/commission/${id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ commission: Number(e.target.value) }),
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
            } else {
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
            console.log("Error changing commission", error);
        }
    };

    const changeCommissionHandler = async (e, id, i) => {
        if (
            Number(e.target.value) !== commissions[i]?.commission &&
            e.target.value
        ) {
            await changeCommission(e, id, i);
            let temp = [...commissions];
            temp[i]?.commission = Number(e.target.value);
            setCommissions(() => temp);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const handleOnChange = (e, rowInd, name) => {
        let updated = [...formData];
        updated[rowInd] = { ...updated[rowInd], [name]: e.target.value };
        setFormData(() => updated);
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
        readCommissions(1, true);
        router.push({
            pathname: `/tkpanel/teacher/commission`,
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
        await readCommissions();
    }

    return (
        <div>
            <BreadCrumbs substituteObj={{ teacher:"استاد", commission:"کمیسیون متغیر استاد" }} />

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={deleteCommission}
            />

            <Box
                title="لیست کمیسیون متغیر استاد"
                buttonInfo={{
                    name: "تعریف کمیسیون",
                    onClick: openModal,
                    color: "primary",
                }}
            >
                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]} onSubmit={handleSubmit}>
                        <div className={`row ${styles["search-row"]}`}>
                        <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="teacher_name"
                                        className={`form__label`}
                                    >
                                        نام استاد :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="text"
                                            name="teacher_name"
                                            id="teacher_name"
                                            className="form__input"
                                            onChange={filtersOnChangeHandler}
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
                                        htmlFor="user_name"
                                        className={`form__label`}
                                    >
                                        نام زبان آموز :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="text"
                                            name="user_name"
                                            id="user_name"
                                            className="form__input"
                                            onChange={filtersOnChangeHandler}
                                            value={filters?.user_name}
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`row ${styles["search-row"]}`}>
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

                <Modal
                    show={isModalOpen}
                    setter={setIsModalOpen}
                    showHeader
                    padding
                >
                    <AddCommission
                        showAlert={showAlert}
                        setIsModalOpen={setIsModalOpen}
                        readCommissions={readCommissions}
                    />
                </Modal>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">زبان آموز</th>
                                <th className="table__head-item">کمیسیون</th>
                                <th className="table__head-item">
                                    تاریخ ایجاد
                                </th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {commissions?.map((commission, i) => (
                                <tr
                                    className="table__body-row"
                                    key={commission?.id}
                                >
                                    <td className="table__body-item">
                                        {commission?.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {commission?.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        <div
                                            className="form-control"
                                            style={{ width: "60px", margin: 0 }}
                                        >
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
                                                value={
                                                    formData[i]?.commission ||
                                                    ""
                                                }
                                                onBlur={(e) =>
                                                    changeCommissionHandler(
                                                        e,
                                                        commission?.id,
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
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment(commission?.created_at).format(
                                            "YYYY/MM/DD hh:mm:ss"
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() =>
                                                deleteCommission(
                                                    commission?.id,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {commissions.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={5}
                                    >
                                        کمیسیونی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>

            {commissions.length !== 0 && (
                <Pagination read={readCommissions} pagData={pagData} />
            )}
        </div>
    );
}

export default Commission;
