import { useState } from "react";
import Box from "../../Elements/Box/Box";
import Alert from "../../../../../Alert/Alert";
import FetchSearchSelect from "../../Elements/FetchSearchSelect/FetchSearchSelect";
import styles from "./TeachersCredit.module.css";
import API from "../../../../../../api/index";
import BreadCrumbs from "../../Elements/Breadcrumbs/Breadcrumbs";
import Pagination from "../../Pagination/Pagination";
import { useRouter } from "next/router";

const filtersSchema = { teacher_name: "" };
const appliedFiltersSchema = { teacher_name: false };
const teacherSchema = { id: "", name: "", family: "", mobile: "" };

function TeachersCredit({
    fetchedTeachers: { data, ...restData },
    token,
    searchData,
}) {
    const [list, setList] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(teacherSchema);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [filters, setFilters] = useState(searchData);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const readTeachersCredit = async (page = 1, avoidFilters = false) => {
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

        router.push({
            pathname: `/tkpanel/installment/teachers`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/credit/teacher?${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const {
                    data: { data, ...restData },
                } = await res.json();
                setList(data);
                setPagData(restData);
            }

            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading teachers credit", error);
        }
    };

    const addTeacherHandler = async () => {
        if (selectedTeacher.id) {
            await addTeacher();
            await readTeachersCredit();
        } else {
            showAlert(true, "danger", "لطفا استاد را انتخاب نمایید");
        }
    };

    const handleLoadings = (state, i) => {
        let temp = [...loadings];
        temp[i] = state;
        setLoadings(() => temp);
    };

    const removeTeacher = async (teacher_id, i) => {
        handleLoadings(true, i);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/credit/teacher/${teacher_id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                const filteredTeachers = list.filter(
                    (teacher) => teacher.id !== teacher_id
                );
                setList(filteredTeachers);
                showAlert(true, "danger", "این استاد حذف شد");
            }
            handleLoadings(false, i);
        } catch (error) {
            console.log("Error removing teacher", error);
        }
    };

    const searchTeachers = async (teacher_name) => {
        setLoading(true);
        try {
            const { data, status, response } = await API.get(
                `/admin/teacher/name/search?name=${teacher_name}`
            );

            if (status === 200) {
                setTeachers(data?.data);
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

    const addTeacher = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/credit/teacher/${selectedTeacher.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(
                    true,
                    "success",
                    `استاد ${selectedTeacher.family} اضافه شد`
                );
            } else {
                const errData = await res.json();
                showAlert(
                    true,
                    "warning",
                    errData?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }
            setLoading(false);
        } catch (error) {
            console.log("Error adding teacher", error);
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
        readTeachersCredit(1, true);
        router.push({
            pathname: `/tkpanel/installment/teachers`,
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
        await readTeachersCredit();
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    installment: "کلاس اعتباری",
                    teachers: "اساتید اعتباری",
                }}
            />

            <Box title="لیست اساتید اعتباری">
                <div className={styles["search"]}>
                    <form
                        className={styles["search-wrapper"]}
                        onSubmit={handleSubmit}
                    >
                        <div className={`${styles["search-row"]}`}>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label
                                    htmlFor="teacher_name"
                                    className={`form__label ${styles.form__label}`}
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

                        <div className={`${styles["search-row"]}`}>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
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
                            <div className={styles["btn-wrapper"]}>
                                <button
                                    type="submit"
                                    className={`btn primary ${styles["btn"]}`}
                                    disabled={loading}
                                >
                                    {loading ? "در حال جستجو ..." : "جستجو"}
                                </button>
                                {showFilters() && (
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

                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={removeTeacher}
                />

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    نام و نام خانوادگی
                                </th>
                                <th className="table__head-item">شماره تماس</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {list?.map((teacher, i) => (
                                <tr
                                    className="table__body-row"
                                    key={teacher?.id}
                                >
                                    <td className="table__body-item">
                                        {`${teacher.name} ${teacher.family}`}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher.mobile || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            className={`action-btn warning`}
                                            onClick={() =>
                                                removeTeacher(teacher.id, i)
                                            }
                                            disabled={loadings[i]}
                                        >
                                            غیرفعال کردن
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {list.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={4}
                                    >
                                        استادی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {list.length !== 0 && (
                    <Pagination read={readTeachersCredit} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default TeachersCredit;
