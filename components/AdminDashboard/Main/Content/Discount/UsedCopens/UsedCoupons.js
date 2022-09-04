import { useState } from "react";
import Box from "../../Elements/Box/Box";
import moment from "jalali-moment";
import Pagination from "../../Pagination/Pagination";
import styles from "./UsedCoupons.module.css";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../../../../constants/index";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";

const filtersSchema = {
    user_name: "",
    teacher_name: "",
    teacher_mobile: "",
    user_mobile: "",
    discount_name: "",
};

const appliedFiltersSchema = {
    user_name: false,
    teacher_name: false,
    teacher_mobile: false,
    user_mobile: false,
    discount_name: false,
};

function UsedCoupons({ fetchedCopens: { data, ...restData }, token }) {
    const [copens, setCoupons] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [filters, setFilters] = useState(filtersSchema);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    moment.locale("fa", { useGregorianParser: true });

    const readCoupons = async (page = 1, avoidFilters = false) => {
        // Constructing search parameters
        let searchQuery = "";
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };

            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    searchQuery += `${key}=${filters[key]}&`;
                    tempFilters[key] = true;
                } else {
                    tempFilters[key] = false;
                }
            });

            setAppliedFilters(tempFilters);
        }
        searchQuery += `page=${page}`;

        router.push({
            pathname: `/tkpanel/useCopen`,
            query: { page },
        });

        try {
            setLoading(true);
            const res = await fetch(
                `${BASE_URL}/admin/discount/used/all?${searchQuery}`,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const {
                data: { data, ...restData },
            } = await res.json();
            setCoupons(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false);
        } catch (error) {
            console.log("Error reading used coupons", error);
        }
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
        readCoupons(1, true);
        router.push({
            pathname: `/tkpanel/useCopen`,
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

        await readCoupons();
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    useCopen: "کدهای تخفیف استفاده شده",
                }}
            />
            <Box title="لیست کدهای تخفیف استفاده شده">
                <div className={styles["search"]}>
                    <form
                        className={styles["search-wrapper"]}
                        onSubmit={handleSubmit}
                    >
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="user_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        نام زبان آموز :
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
                                        شماره زبان آموز :
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
                                        نام استاد :
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
                                        شماره استاد :
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
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="discount_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        کد تخفیف و عنوان :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="discount_name"
                                            id="discount_name"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.discount_name}
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
                                <th className="table__head-item">
                                    نام زبان آموز
                                </th>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">کد تخفیف</th>
                                <th className="table__head-item">تاریخ</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {copens?.map((copen) => (
                                <tr className="table__body-row" key={copen?.id}>
                                    <td className="table__body-item">
                                        {copen.user_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {copen.teacher_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {copen.discount?.name}
                                    </td>
                                    <td className="table__body-item">
                                        {copen.discount?.expired_at
                                            ? moment(
                                                  copen.discount?.expired_at
                                              ).format("YYYY/MM/DD hh:mm:ss")
                                            : "-"}
                                    </td>
                                </tr>
                            ))}

                            {copens.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={4}
                                    >
                                        کوپنی یافت نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {copens.length !== 0 && (
                    <Pagination read={readCoupons} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default UsedCoupons;
