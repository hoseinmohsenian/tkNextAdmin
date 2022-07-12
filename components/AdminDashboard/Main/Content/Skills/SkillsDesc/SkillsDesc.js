import { useState } from "react";
import Link from "next/link";
import Box from "../../Elements/Box/Box";
import Pagination from "../../Pagination/Pagination";
import Modal from "../../../../../Modal/Modal";
import { BASE_URL } from "../../../../../../constants";
import { useRouter } from "next/router";
import styles from "../Skills.module.css";

const filtersSchema = {
    persian_name: "",
    english_name: "",
};
const appliedFiltersSchema = {
    persian_name: false,
    english_name: false,
};

function SkillsDesc({ fetchedSkills: { data, ...restData }, token }) {
    const [skills, setSkills] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [openModal, setOpenModal] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState({});
    const [filters, setFilters] = useState(filtersSchema);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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
            pathname: `/content/skill/description/inf`,
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
        readSkills(1, true);
        router.push({
            pathname: `/content/skill/description/inf`,
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
            <Box
                title="توضیحات مهارت ها"
                buttonInfo={{
                    name: "لیست مهارت ها",
                    url: "/content/skill",
                    color: "primary",
                }}
            >
                {openModal && (
                    <Modal
                        backgroundColor="white"
                        showHeader={true}
                        show={openModal}
                        setter={setOpenModal}
                        padding={true}
                    >
                        <h3 className={"modal__title"}>جزئیات تخصص</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>h1</span>
                                <span className={"modal__item-body"}>
                                    {selectedSkill.h1 || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    کلید سئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedSkill.seo_key || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    توضیحات سئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedSkill.seo_desc || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    عنوان سئو
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedSkill.title_seo || "-"}
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
                                type="button"
                                className={`btn primary ${styles["btn"]}`}
                                disabled={loading}
                                onClick={() => readSkills()}
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
                                <th className="table__head-item">تخصص</th>
                                <th className="table__head-item">url</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {skills?.map((sk) => (
                                <tr className="table__body-row" key={sk?.id}>
                                    <td className="table__body-item">
                                        {sk?.persian_name}
                                    </td>
                                    <td className="table__body-item">
                                        {sk?.english_name}
                                    </td>
                                    <td className="table__body-item">
                                        {sk?.speciality?.persian_name}
                                    </td>
                                    <td className="table__body-item">
                                        {sk?.url || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/content/skill/description/inf/${sk?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>{" "}
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedSkill(sk);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {skills.length !== 0 && (
                    <Pagination read={readSkills} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default SkillsDesc;
