import { useState } from "react";
import Box from "../../Elements/Box/Box";
import Alert from "../../../../../Alert/Alert";
import styles from "./ClassList.module.css";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";
import API from "../../../../../../api";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";
import TeacherMobileTooltip from "../../../../../TeacherMobileTooltip/TeacherMobileTooltip";
import { AiFillEye } from "react-icons/ai";
import Link from "next/link";
import Modal from "../../../../../Modal/Modal";
import moment from "jalali-moment";

const filtersSchema = {
    teacher_name: "",
    teacher_mobile: "",
    user_name: "",
    user_mobile: "",
};
const appliedFiltersSchema = {
    teacher_name: false,
    teacher_mobile: false,
    user_name: false,
    user_mobile: false,
};

function ClassList({ fetchedList: { data, ...restData }, searchData }) {
    const [list, setList] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [filters, setFilters] = useState(searchData);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const router = useRouter();
    moment.locale("fa", { useGregorianParser: true });

    const readClassList = async (page = 1, avoidFilters = false) => {
        const isFilterEnabled = (key) =>
            Number(filters[key]) !== 0 &&
            filters[key] !== undefined &&
            filters[key];
        let searchQuery = "";
        let searchParams = {};
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };

            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    searchQuery += `${key}=${filters[key]}&`;
                    tempFilters[key] = true;
                    searchParams = { ...searchParams, [key]: filters[key] };
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
            pathname: `/tkpanel/installment/list`,
            query: searchParams,
        });

        try {
            const { data, status, response } = await API.get(
                `/admin/credit/reserve?${searchQuery}`
            );

            if (status === 200) {
                const { data: listData, ...restData } = data?.data;
                setList(listData);
                setPagData(restData);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }

            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading class list", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
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
        readClassList(1, true);
        router.push({
            pathname: `/tkpanel/installment/list`,
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
        await readClassList();
    };

    const readInstalment = async () => {
        setLoading(true);
        try {
            const { data, status, response } = await API.get(
                `/admin/credit/reserve/${selectedItem.credit_id}`
            );

            if (status === 200) {
                console.log(data.data);
                setSelectedItem({ ...selectedItem, list: data?.data });
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error reading credit list", error);
        }
        setLoading(false);
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    installment: "کلاس اعتباری",
                    list: "کلاس های اعتباری",
                }}
            />

            <Box title="لیست کلاس های اعتباری">
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات کلاس اعتباری</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    مدت زمان
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedItem.credit?.time
                                        ? `${selectedItem.credit?.time} دقیقه`
                                        : "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    تعداد قسط
                                </span>
                                <span
                                    className={"modal__item-body"}
                                    style={{ overflowX: "auto" }}
                                >
                                    {selectedItem.credit?.month_number} قسط
                                    {!selectedItem.list && (
                                        <button
                                            type="button"
                                            onClick={readInstalment}
                                            className={`action-btn primary-outline`}
                                            style={{
                                                marginRight: 10,
                                            }}
                                            disabled={loading}
                                        >
                                            نمایش اقساط
                                        </button>
                                    )}
                                    {selectedItem.list &&
                                        selectedItem.list.length === 0 && (
                                            <div className="warning-color">
                                                قسطی وجود ندارد!
                                            </div>
                                        )}
                                    {selectedItem.list && (
                                        <div className="table__wrapper">
                                            <table className="table">
                                                <thead className="table__head">
                                                    <tr>
                                                        <th className="table__head-item">
                                                            تاریخ
                                                        </th>
                                                        <th className="table__head-item">
                                                            تاریخ پرداخت
                                                        </th>
                                                        <th className="table__head-item">
                                                            قیمت
                                                        </th>
                                                        <th className="table__head-item">
                                                            first
                                                        </th>
                                                        <th className="table__head-item">
                                                            last
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table__body">
                                                    {selectedItem.list?.map(
                                                        (item, i) => (
                                                            <tr
                                                                className="table__body-row"
                                                                key={item.id}
                                                            >
                                                                <td className="table__body-item">
                                                                    {item.date
                                                                        ? moment(
                                                                              item.date
                                                                          ).format(
                                                                              "YYYY-MM-DD"
                                                                          )
                                                                        : "-"}
                                                                </td>
                                                                <td className="table__body-item">
                                                                    {item.pay_time
                                                                        ? moment(
                                                                              item.pay_time
                                                                          ).format(
                                                                              "YYYY-MM-DD"
                                                                          )
                                                                        : "-"}
                                                                </td>
                                                                <td className="table__body-item">
                                                                    {item.price
                                                                        ? `${Intl.NumberFormat().format(
                                                                              item.price
                                                                          )} تومان`
                                                                        : "-"}
                                                                </td>
                                                                <td className="table__body-item">
                                                                    {item.first ===
                                                                    0
                                                                        ? `0`
                                                                        : `1`}
                                                                </td>
                                                                <td className="table__body-item">
                                                                    {item.last ===
                                                                    0
                                                                        ? `0`
                                                                        : `1`}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
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
                                        className={`form__label`}
                                    >
                                        نام استاد :
                                    </label>
                                    <div className="form-control">
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
                                        htmlFor="teacher_mobile"
                                        className={`form__label`}
                                    >
                                        موبایل استاد :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="number"
                                            name="teacher_mobile"
                                            id="teacher_mobile"
                                            className="form__input"
                                            onChange={filtersOnChangeHandler}
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
                                        className={`form__label`}
                                    >
                                        نام زبان آموز :
                                    </label>
                                    <div className="form-control">
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
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="user_mobile"
                                        className={`form__label`}
                                    >
                                        موبایل زبان آموز :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="number"
                                            name="user_mobile"
                                            id="user_mobile"
                                            className="form__input"
                                            onChange={filtersOnChangeHandler}
                                            value={filters?.user_mobile}
                                            spellCheck={false}
                                        />
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

                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={readClassList}
                />

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">زبان آموز</th>
                                <th className="table__head-item">
                                    موبایل زبان آموز
                                </th>
                                <th className="table__head-item">
                                    تعداد جلسات
                                </th>
                                <th className="table__head-item">
                                    جلسه در هفته
                                </th>
                                <th className="table__head-item">قیمت کل</th>
                                <th className="table__head-item">قیمت قسط</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {list?.map((item, i) => (
                                <tr className="table__body-row" key={item?.id}>
                                    <td className="table__body-item">
                                        {item.teacher?.name
                                            ? item.teacher?.name +
                                              " " +
                                              item.teacher?.family
                                            : "-"}

                                        <TeacherMobileTooltip
                                            mobile={item.teacher?.mobile}
                                        />
                                    </td>
                                    <td className="table__body-item">
                                        {item.user?.name_family || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item.user?.mobile || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item.credit?.number || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item.credit?.number_in_week || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item.credit?.price
                                            ? `${Intl.NumberFormat().format(
                                                  item.credit?.price
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item.credit?.list_price
                                            ? `${Intl.NumberFormat().format(
                                                  item.credit?.list_price
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            className={`primary-color`}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setOpenModal(true);
                                                setSelectedItem(item);
                                            }}
                                        >
                                            <AiFillEye size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {list.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={3}
                                    >
                                        زبان آموزی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {list.length !== 0 && (
                    <Pagination read={readClassList} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default ClassList;
