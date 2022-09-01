import { useState } from "react";
import styles from "./ShowCategories.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Box from "../Elements/Box/Box";
import Modal from "../../../../Modal/Modal";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";
import API from "../../../../../api/index";

const filtersSchema = {
    title: "",
};
const appliedFiltersSchema = {
    title: false,
};

function ShowCategories({
    fetchedCategories,
    title,
    createPage,
    addressPage,
    type,
}) {
    const [categories, setCategories] = useState(fetchedCategories);
    const { asPath } = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({});
    const [filters, setFilters] = useState(filtersSchema);
    const [appliedFilters, setAppliedFilters] = useState(appliedFiltersSchema);
    const [loading, setLoading] = useState(false);
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

    const searchCategories = async (avoidFilters = false) => {
        setLoading(true);

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

        try {
            const { data, status, response } = await API.get(
                `/admin/blog/category?type=${type}&${searchQuery}`
            );

            if (status === 200) {
                setCategories(data?.data);
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
            setLoading(false);
        } catch (error) {
            console.log("Error reading categories", error);
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
        searchCategories(true);
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
            <BreadCrumbs
                substituteObj={{
                    newsSubCategories: "دسته بندی اول مقالات",
                    siteNewsCategories: "دسته بندی دوم مقالات",
                    categoriesLevel3: "دسته بندی سوم مقالات",
                }}
            />

            <Box
                title={title}
                buttonInfo={{
                    name: "ایجاد دسته بندی",
                    url: createPage,
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
                        <h3 className={"modal__title"}>جزئیات دسته بندی</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    header
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedCategory?.header || "-"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>
                                    توضیحات کوتاه
                                </span>
                                <span className={"modal__item-body"}>
                                    {selectedCategory?.summary_desc || "-"}
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
                                        htmlFor="title"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        عنوان :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            className="form__input form__input--ltr"
                                            onChange={handleOnChange}
                                            value={filters?.title}
                                            spellCheck={false}
                                            placeholder="نام دسته بندی"
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
                                        onClick={(e) => {
                                            e.preventDefault();
                                            searchCategories();
                                        }}
                                    >
                                        {loading ? "در حال انجام ..." : "جستجو"}
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
                                <th className="table__head-item">عنوان</th>
                                {type >= 2 && (
                                    <th className="table__head-item">
                                        دسته بندی اول
                                    </th>
                                )}
                                {type >= 3 && (
                                    <th className="table__head-item">
                                        دسته بندی دوم
                                    </th>
                                )}
                                <th className="table__head-item">تصویر</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {categories?.map((ctg) => (
                                <tr className="table__body-row" key={ctg?.id}>
                                    <td
                                        className={`table__body-item ${styles["table-item"]}`}
                                    >
                                        {ctg?.title}
                                    </td>
                                    {type >= 2 && (
                                        <td
                                            className={`table__body-item ${styles["table-item"]}`}
                                        >
                                            {ctg?.first_parent?.title || "-"}
                                        </td>
                                    )}
                                    {type >= 3 && (
                                        <td
                                            className={`table__body-item ${styles["table-item"]}`}
                                        >
                                            {ctg?.second_parent?.title || "-"}
                                        </td>
                                    )}
                                    <td
                                        className={`table__body-item ${styles["table-item"]}`}
                                    >
                                        {ctg?.image ? (
                                            <img
                                                src={ctg?.image}
                                                alt={ctg?.title}
                                                className={
                                                    styles["category-img"]
                                                }
                                            />
                                        ) : (
                                            "-"
                                        )}
                                        &nbsp; &nbsp;
                                    </td>
                                    <td
                                        className={`table__body-item ${styles["table-item"]}`}
                                    >
                                        <Link
                                            href={`${SITE_URL}/${addressPage}/${ctg?.url}`}
                                        >
                                            <a
                                                className="action-btn primary"
                                                target="_blank"
                                            >
                                                آدرس‌&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`${asPath}/${ctg?.id}/edit`}
                                        >
                                            <a className="action-btn warning">
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedCategory(ctg);
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
            </Box>
        </div>
    );
}

export default ShowCategories;
