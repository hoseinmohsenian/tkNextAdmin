import { useState } from "react";
import Link from "next/link";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import styles from "./Skills.module.css";
import { useRouter } from "next/router";
import DeleteModal from "../../../../DeleteModal/DeleteModal";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

const filtersSchema = {
    persian_name: "",
    english_name: "",
};
const appliedFiltersSchema = {
    persian_name: false,
    english_name: false,
};

function Skills({ fetchedSkills: { data, ...restData }, token }) {
    const [skills, setSkills] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [filters, setFilters] = useState(filtersSchema);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [dModalVisible, setDModalVisible] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState({});
    const router = useRouter();
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    const deleteSkill = async (skill_id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teaching/skill/${skill_id}`,
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
                showAlert(true, "danger", "این مهارت حذف شد");
                setDModalVisible(false);
                await readSkills();
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting skills", error);
        }
    };

    const readSkills = async (page = 1, avoidFilters = false) => {
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
            pathname: `/content/skill`,
            query: { page },
        });

        try {
            setLoading(true);
            const res = await fetch(
                `${BASE_URL}/admin/teaching/skill?${searchQuery}`,
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
            setSkills(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false);
        } catch (error) {
            console.log("Error reading skills", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);
        readSkills(1, true);
        router.push({
            pathname: `/content/skill`,
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

        await readSkills();
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    content: "محتوا",
                    skill: "مهارت ها",
                }}
            />

            <Box
                title="لیست مهارت ها"
                buttonInfo={{
                    name: "ایجاد مهارت",
                    url: "/content/skill/create",
                    color: "primary",
                }}
            >
                <DeleteModal
                    visible={dModalVisible}
                    setVisible={setDModalVisible}
                    title="حذف مهارت"
                    bodyDesc={`آیا از حذف مهارت «${selectedSkill.persian_name}» اطمینان دارید؟`}
                    handleOk={() => {
                        deleteSkill(selectedSkill?.id, selectedSkill.index);
                    }}
                    confirmLoading={loadings[selectedSkill.index]}
                />

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
                                        htmlFor="persian_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        نام فارسی :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="text"
                                            name="persian_name"
                                            id="persian_name"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.persian_name}
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
                                        htmlFor="english_name"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        نام انگلیسی :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="text"
                                            name="english_name"
                                            id="english_name"
                                            className="form__input form__input--ltr"
                                            onChange={handleOnChange}
                                            value={filters?.english_name}
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
                                    عنوان فارسی
                                </th>
                                <th className="table__head-item">
                                    عنوان انگلیسی
                                </th>
                                <th className="table__head-item">نام تخصص</th>
                                <th
                                    className="table__head-item"
                                    style={{ fontSize: "1rem" }}
                                >
                                    url
                                </th>
                                <th className="table__head-item">توضیحات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {skills?.map((sk, i) => (
                                <tr className="table__body-row" key={sk?.id}>
                                    <td className="table__body-item">
                                        <Link
                                            href={`${SITE_URL}/find-teachers/${sk.language?.english_name}/${sk.speciality?.english_name}/${sk.url}`}
                                        >
                                            <a
                                                className="table__body-link"
                                                target="_blank"
                                            >
                                                {sk?.persian_name}
                                            </a>
                                        </Link>
                                    </td>
                                    <td className="table__body-item">
                                        {sk?.english_name}
                                    </td>
                                    <td className="table__body-item">
                                        {sk?.speciality.persian_name}
                                    </td>
                                    <td className="table__body-item">
                                        {sk?.url}
                                    </td>
                                    <td className="table__body-item">
                                        <Link href={`/content/skill/${sk?.id}`}>
                                            <a className={`action-btn primary`}>
                                                افزودن&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/content/skill/${sk?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() => {
                                                setSelectedSkill({
                                                    ...sk,
                                                    index: i,
                                                });
                                                setDModalVisible(true);
                                            }}
                                            disabled={loadings[i]}
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {skills?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={5}
                                    >
                                        مهارتی پیدا نشد !
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {skills.length !== 0 && (
                    <Pagination read={readSkills} pagData={pagData} />
                )}
            </Box>

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={deleteSkill}
            />
        </div>
    );
}

export default Skills;
