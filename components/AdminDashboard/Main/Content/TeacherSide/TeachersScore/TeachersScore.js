import { useState } from "react";
import { BASE_URL } from "../../../../../../constants";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import Box from "../../Elements/Box/Box";
import ReactTooltip from "react-tooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";
import { Typography } from "antd";
import Ellipsis from "../../../../../Ellipsis/Ellipsis";
import styles from "../Teachers.module.css";

const filtersSchema = { teacher_name: "" };
const appliedFiltersSchema = { teacher_name: false };

function TeachersScore(props) {
    const {
        fetchedTeachers: { data, ...restData },
        token,
        searchData,
    } = props;
    const [teachers, setTeachers] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [ellipsis, setEllipsis] = useState(
        [...Array(data.length)].fill(true)
    );
    const [filters, setFilters] = useState(searchData);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    moment.locale("fa", { useGregorianParser: true });

    const readTeachers = async (page = 1, avoidFilters = false) => {
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

        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/score/minus/getAllScores`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/point?${searchQuery}`,
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
            setTeachers(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading teachers", error);
        }
        setLoading(false);
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
            pathname: `/score/minus/getAllScores`,
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
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    score: "استاد",
                    getAllScores: "امتیاز منفی اساتید",
                }}
            />

            <Box
                title="امتیاز منفی اساتید"
                buttonInfo={{
                    name: "ایجاد",
                    url: "/score/minus/createScore",
                    color: "primary",
                }}
            >
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
                                        style={{ minWidth: 70, maxWidth: 70 }}
                                    >
                                        نام استاد‌ :
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

                <ReactTooltip className="tooltip" />

                <div className="table__wrapper table__wrapper--wrap">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th
                                    className="table__head-item"
                                    style={{
                                        width: 130,
                                    }}
                                >
                                    استاد
                                </th>
                                <th className="table__head-item">امتیاز</th>
                                <th className="table__head-item">
                                    تاثیر در حسابداری
                                </th>
                                <th
                                    className="table__head-item table__head-ite-ellipsis"
                                    style={{ width: 380 }}
                                >
                                    توضیحات
                                </th>
                                <th className="table__head-item">ثبت کننده</th>
                                <th className="table__head-item">
                                    تاریخ ایجاد
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {teachers?.map((teacher, i) => (
                                <tr
                                    className="table__body-row"
                                    key={teacher?.id}
                                >
                                    <td
                                        className="table__body-item"
                                        data-tip={
                                            teacher?.teacher_mobile || "-"
                                        }
                                        style={{
                                            width: 130,
                                        }}
                                    >
                                        {teacher?.teacher_name}
                                        <span className="info-icon">
                                            <AiOutlineInfoCircle />
                                        </span>
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {`${
                                            teacher?.point_type === 0
                                                ? "-"
                                                : "+"
                                        }${teacher?.number}`}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.accounting_effect === 1
                                            ? "بله"
                                            : "خیر"}
                                    </td>
                                    <td
                                        className="table__body-item table__body-ite--ellipsis"
                                        style={{
                                            width: 380,
                                        }}
                                    >
                                        <Ellipsis
                                            ellipsis={ellipsis[i]}
                                            width={290}
                                            onClick={() => {
                                                let temp = [...ellipsis];
                                                temp[i] = !temp[i];
                                                setEllipsis(() => temp);
                                            }}
                                            text={teacher.desc || ""}
                                        />
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.admin_name}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {moment(teacher?.created_at).format(
                                            "YYYY/MM/DD hh:mm:ss"
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {teachers?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={7}
                                    >
                                        استادی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {teachers?.length !== 0 && teachers && (
                    <Pagination read={readTeachers} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default TeachersScore;
