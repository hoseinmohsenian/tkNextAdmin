import { useState } from "react";
import Link from "next/link";
import Box from "../Elements/Box/Box";
import styles from "./TeacherInterview.module.css";
import FetchSearchSelect from "../Elements/FetchSearchSelect/FetchSearchSelect";
import API from "../../../../../api/index";
import Alert from "../../../../Alert/Alert";
import { useRouter } from "next/router";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";
import moment from "jalali-moment";

const teacherSchema = { id: "", name: "", family: "", mobile: "" };
const filtersSchema = { teacher_name: "", teacher_mobile: "" };
const appliedFiltersSchema = { teacher_name: false, teacher_mobile: false };

function TeacherInterview({ teachers: teachersInterviews, token, searchData }) {
    const [interviews, setInterviews] = useState(teachersInterviews);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(searchData);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const router = useRouter();
    moment.locale("fa", { useGregorianParser: true });

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const searchTeachers = async (teacher_name) => {
        setLoading(true);
        try {
            const { data, status, response } = await API.get(
                `/admin/teacher/name/search?name=${teacher_name}`
            );

            if (status === 200) {
                setTeachers(data?.data || []);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
        } catch (error) {
            console.log("Error searching teachers", error);
        }
        setLoading(false);
    };

    const addTeacherHandler = () => {
        if (selectedTeacher.id) {
            router.push(
                `/tkpanel/teacherInterviewsCategories/${selectedTeacher.id}`
            );
        } else {
            showAlert(true, "danger", "لطفا استاد را انتخاب کنید");
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

    const readInterviews = async (avoidFilters = false) => {
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
                } else {
                    tempFilters[key] = false;
                }
            });

            setAppliedFilters(tempFilters);
        }

        if (!avoidFilters) {
            if (isFilterEnabled("teacher_name")) {
                searchParams = {
                    ...searchParams,
                    teacher_name: filters?.teacher_name,
                };
            }
            if (isFilterEnabled("teacher_mobile")) {
                searchParams = {
                    ...searchParams,
                    teacher_mobile: filters?.teacher_mobile,
                };
            }
        }

        router.push({
            pathname: `/tkpanel/teacherInterviewsCategories`,
            query: searchParams,
        });

        try {
            setLoading(true);
            const res = await fetch(
                `${BASE_URL}/admin/teacher/interview?${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setInterviews(data);
            setLoading(false);
        } catch (error) {
            console.log("Error reading interviews", error);
        }
    };

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);
        readInterviews(true);
        router.push({
            pathname: `/tkpanel/teacherInterviewsCategories`,
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
        await readInterviews();
    };

    return (
        <div>
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={searchTeachers}
            />
            <BreadCrumbs
                substituteObj={{
                    teacherInterviewsCategories: "مصاحبه اساتید",
                }}
            />

            <Box title="مصاحبه اساتید">
                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`${styles["search-row"]}`}>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label
                                    htmlFor="teacher_name"
                                    className={`form__label ${styles["search-label"]}`}
                                >
                                    استاد :<span className="form__star">*</span>
                                </label>
                                <div
                                    className={`form-control form-control-searchselect`}
                                >
                                    <FetchSearchSelect
                                        list={teachers}
                                        setList={setTeachers}
                                        placeholder="جستجو کنید"
                                        selected={selectedTeacher}
                                        id="id"
                                        displayKey="family"
                                        displayPattern={[
                                            {
                                                member: true,
                                                key: "name",
                                            },
                                            { member: false, key: " " },
                                            {
                                                member: true,
                                                key: "family",
                                            },
                                            { member: false, key: " - " },
                                            { member: true, key: "mobile" },
                                        ]}
                                        setSelected={setSelectedTeacher}
                                        noResText="استادی پیدا نشد"
                                        listSchema={teacherSchema}
                                        stylesProps={{
                                            width: "100%",
                                        }}
                                        background="#fafafa"
                                        onSearch={(value) =>
                                            searchTeachers(value)
                                        }
                                        openBottom={true}
                                    />
                                </div>
                            </div>
                            <div className={styles["btn-wrapper"]}>
                                <button
                                    type="button"
                                    className={`btn primary ${styles["btn"]}`}
                                    disabled={loading}
                                    onClick={() => addTeacherHandler()}
                                >
                                    {loading ? "در حال جستجو ..." : "افزودن"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

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
                                        htmlFor="teacher_mobile"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        موبایل استاد :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
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
                            <div
                                className={styles["btn-wrapper"]}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: 10,
                                }}
                            >
                                <button
                                    type="submit"
                                    className={`btn primary ${styles["btn"]}`}
                                    disabled={loading}
                                >
                                    {loading ? "در حال جستجو ..." : "جستجو"}
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
                    </form>
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام استاد</th>
                                <th className="table__head-item">
                                    تعداد سوالات
                                </th>
                                <th className="table__head-item">تاریخ</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {interviews?.map((interview) => (
                                <tr
                                    className="table__body-row"
                                    key={interview?.teacher_id}
                                >
                                    <td className="table__body-item">
                                        {interview?.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {interview?.number}
                                    </td>
                                    <td className="table__body-item">
                                        {interview?.created_at
                                            ? moment(
                                                  interview?.created_at
                                              ).format("DD MMM YYYY ساعت hh:mm")
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/teacherInterviewsCategories/${interview?.teacher_id}`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {interviews.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={5}
                                    >
                                        استادی وجود ندارد!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>
        </div>
    );
}

export default TeacherInterview;
