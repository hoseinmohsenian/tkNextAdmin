import { useState } from "react";
import styles from "./Articles.module.css";
import Alert from "../../../../Alert/Alert";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "jalali-moment";
import Box from "../Elements/Box/Box";
import Modal from "../../../../Modal/Modal";
import DeleteModal from "../../../../DeleteModal/DeleteModal";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

const filtersSchema = {
    language_id: 0,
    admin_id: 0,
    order_by: 0,
    draft: 0,
    title: "",
};
const appliedFiltersSchema = {
    language_id: false,
    admin_id: false,
    order_by: false,
    draft: false,
    title: false,
};

function Articles(props) {
    const {
        fetchedArticles: { data, ...restData },
        token,
        languages,
        admins,
        searchData: fetchedData,
    } = props;
    const [articles, setArticles] = useState(data);
    const [filters, setFilters] = useState(fetchedData);
    const [appliedFilters, setAppliedFilters] = useState(fetchedData);
    const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [openModal, setOpenModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState({});
    const [dModalVisible, setDModalVisible] = useState(false);
    const router = useRouter();
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    moment.locale("fa", { useGregorianParser: true });

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const changeDraft = async (article_id, draft, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/blog/article/${article_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ draft: draft === 0 ? 1 : 0 }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = `این مقاله ${
                    draft === 1 ? "منتشر" : "پیش نویس"
                } شد`;
                showAlert(true, draft === 1 ? "success" : "warning", message);
                let updated = [...articles];
                updated[i] = { ...updated[i], draft: draft === 0 ? 1 : 0 };
                setArticles(() => updated);
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error changing draft", error);
        }
    };

    const readArticles = async (page = 1, avoidFilters = false) => {
        setLoading(true);
        let searchParams = {};

        const isFilterEnabled = (key) =>
            Number(filters[key]) !== 0 &&
            filters[key] !== undefined &&
            filters[key];
        const findItem = (data, id) =>
            data?.find((item) => item?.id === Number(id));

        // Constructing search parameters
        let searchQuery = "";
        if (!avoidFilters) {
            let tempFilters = { ...appliedFilters };

            Object.keys(filters).forEach((key) => {
                if (Number(filters[key]) !== 0) {
                    if (key === "draft" && filters["draft"]) {
                        searchQuery += `draft=1&`;
                    } else {
                        searchQuery += `${key}=${filters[key]}&`;
                    }
                    tempFilters[key] = true;
                } else {
                    tempFilters[key] = false;
                }
            });

            setAppliedFilters(tempFilters);

            if (isFilterEnabled("language_id")) {
                searchParams = {
                    ...searchParams,
                    language: findItem(languages, filters?.language_id)
                        ?.english_name,
                };
            }
            if (isFilterEnabled("admin_id")) {
                searchParams = {
                    ...searchParams,
                    admin: findItem(admins, filters?.admin_id)?.name,
                };
            }
            if (isFilterEnabled("order_by")) {
                if (
                    filters?.order_by.toLowerCase() === "desc" ||
                    filters?.order_by.toLowerCase() === "asc"
                ) {
                    searchParams = {
                        ...searchParams,
                        order_by: filters?.order_by,
                    };
                }
            }
            if (isFilterEnabled("draft")) {
                searchParams = {
                    ...searchParams,
                    draft: filters?.draft ? 1 : 0,
                };
            }
            if (isFilterEnabled("title")) {
                searchParams = {
                    ...searchParams,
                    title: filters?.title,
                };
            }
        }
        searchQuery += `page=${page}`;

        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/tkpanel/siteNews`,
            query: searchParams,
        });

        try {
            const res = await fetch(
                `${BASE_URL}/admin/blog/article?${searchQuery}`,
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
            setArticles(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            setLoading(false);
        } catch (error) {
            console.log("Error reading articles", error);
        }
    };

    const deleteArticle = async (article_id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/blog/article/${article_id}`,
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
                showAlert(true, "danger", "این مقاله حذف شد");
                setDModalVisible(false);
                await readArticles();
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting article", error);
        }
    };

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);
        readArticles(1, true);
        router.push({
            pathname: `/tkpanel/siteNews`,
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

        await readArticles();
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    siteNews: "مقالات",
                }}
            />

            <Box
                title="لیست مقالات"
                buttonInfo={{
                    name: "ایجاد مقاله",
                    url: "/tkpanel/siteNews/create",
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
                        <h3 className={"modal__title"}>جزئیات مقاله</h3>
                        <div className={"modal__wrapper"}>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>URL</span>
                                <span className={"modal__item-body"}>
                                    {selectedArticle?.url}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>نوع</span>
                                <span className={"modal__item-body"}>
                                    {selectedArticle?.type === 1
                                        ? "ویدئو"
                                        : "استاندارد"}
                                </span>
                            </div>
                            <div className={"modal__item"}>
                                <span className={"modal__item-title"}>پین</span>
                                <span className={"modal__item-body"}>
                                    {selectedArticle?.pin === 1
                                        ? "پین شده"
                                        : "پین نشده"}
                                </span>
                            </div>
                        </div>
                    </Modal>
                )}

                <DeleteModal
                    visible={dModalVisible}
                    setVisible={setDModalVisible}
                    title="حذف مقاله"
                    bodyDesc={`آیا از حذف مقاله «${selectedArticle.title}» اطمینان دارید؟`}
                    handleOk={() => {
                        deleteArticle(
                            selectedArticle?.id,
                            selectedArticle.index
                        );
                    }}
                    confirmLoading={loadings[selectedArticle.index]}
                />

                <div className={styles["search"]}>
                    <form
                        className={styles["search-wrapper"]}
                        onSubmit={handleSubmit}
                    >
                        <div className={`row ${styles["search-row"]}`}>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="language_id"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        زبان :
                                    </label>
                                    <div className="form-control">
                                        <select
                                            name="language_id"
                                            id="language_id"
                                            className="form__input input-select"
                                            onChange={handleOnChange}
                                            value={filters.language_id}
                                        >
                                            <option value={0}>
                                                انتخاب کنید
                                            </option>
                                            {languages?.map((lan) => (
                                                <option
                                                    key={lan?.id}
                                                    value={lan?.id}
                                                >
                                                    {lan?.persian_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className={`col-sm-6 ${styles["search-col"]}`}>
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="admin_id"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        نویسنده :
                                    </label>
                                    <div className="form-control">
                                        <select
                                            name="admin_id"
                                            id="admin_id"
                                            className="form__input input-select"
                                            onChange={handleOnChange}
                                            value={filters.admin_id}
                                        >
                                            <option value={0}>
                                                انتخاب کنید
                                            </option>
                                            {admins?.map((admin) => (
                                                <option
                                                    key={admin?.id}
                                                    value={admin?.id}
                                                >
                                                    {admin?.name}
                                                </option>
                                            ))}
                                        </select>
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
                                        htmlFor="title"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        عنوان :
                                    </label>
                                    <div className="form-control">
                                        <input
                                            type="text"
                                            name="title"
                                            id="title"
                                            className="form__input"
                                            onChange={handleOnChange}
                                            value={filters?.title}
                                            autoComplete="off"
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
                                        htmlFor="draft"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        مرتب :
                                    </label>
                                    <div className="form-control form-control-radio">
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="asc"
                                                className="radio-title"
                                            >
                                                صعودی
                                            </label>
                                            <input
                                                type="radio"
                                                name="order_by"
                                                onChange={handleOnChange}
                                                value="asc"
                                                checked={
                                                    filters.order_by === "asc"
                                                }
                                                id="asc"
                                            />
                                        </div>
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="desc"
                                                className="radio-title"
                                            >
                                                نزولی
                                            </label>
                                            <input
                                                type="radio"
                                                name="order_by"
                                                onChange={handleOnChange}
                                                value="desc"
                                                checked={
                                                    filters.order_by === "desc"
                                                }
                                                id="desc"
                                            />
                                        </div>
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="both"
                                                className="radio-title"
                                            >
                                                هیچ کدام
                                            </label>
                                            <input
                                                type="radio"
                                                name="order_by"
                                                onChange={handleOnChange}
                                                value={0}
                                                checked={
                                                    Number(filters.order_by) ===
                                                    0
                                                }
                                                id="both"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`row ${styles["search-row"]}`}>
                            <div
                                className={`col-sm-12 ${styles["search-col"]}`}
                            >
                                <div
                                    className={`input-wrapper ${styles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="draft"
                                        className={`form__label ${styles["search-label"]}`}
                                    >
                                        وضعیت :
                                    </label>
                                    <div className="form-control form-control-radio">
                                        <div className="input-radio-wrapper">
                                            <label
                                                htmlFor="is_draft"
                                                className="radio-title"
                                            >
                                                پیش نویس
                                            </label>
                                            <input
                                                type="checkbox"
                                                name="draft"
                                                onChange={handleOnChange}
                                                value={1}
                                                checked={
                                                    Number(filters.draft) === 1
                                                }
                                                id="is_draft"
                                            />
                                        </div>
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

                {/* Alert */}
                <Alert
                    {...alertData}
                    removeAlert={showAlert}
                    envoker={changeDraft}
                />

                <div className="table__wrapper">
                    <table className="table" cellSpacing={0} cellPadding={0}>
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item table__head-item--ellipsis">
                                    عنوان
                                </th>
                                <th className="table__head-item">زبان</th>
                                <th className="table__head-item">
                                    نام نویسنده
                                </th>
                                <th className="table__head-item">
                                    تاریخ انتشار
                                </th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {articles?.map((article, i) => (
                                <tr
                                    className="table__body-row"
                                    key={article?.id}
                                >
                                    <td
                                        className="table__body-item table__body-item--ellipsis"
                                        style={{
                                            width: 300,
                                        }}
                                    >
                                        {article?.title}
                                    </td>
                                    <td className="table__body-item">
                                        {article?.language_name}
                                    </td>
                                    <td className="table__body-item">
                                        {article?.admin_name || "-"}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {article?.publish_time
                                            ? moment(
                                                  article?.publish_time
                                              ).format("YYYY/MM/DD hh:mm:ss")
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() => {
                                                setSelectedArticle({
                                                    ...article,
                                                    index: i,
                                                });
                                                setDModalVisible(true);
                                            }}
                                            disabled={loadings[i]}
                                        >
                                            حذف
                                        </button>
                                        <Link
                                            href={`/tkpanel/siteNews/${article?.id}/edit`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش &nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`${SITE_URL}/blog/${article?.url}`}
                                            disabled={loadings[i]}
                                        >
                                            <a
                                                className={`action-btn primary`}
                                                target="_blank"
                                            >
                                                نمایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                article?.draft === 1
                                                    ? "success"
                                                    : "warning"
                                            }`}
                                            onClick={() =>
                                                changeDraft(
                                                    article?.id,
                                                    article?.draft,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            {article?.draft === 0
                                                ? "پیش نویس"
                                                : "منتشر"}
                                        </button>
                                        <button
                                            className={`action-btn success`}
                                            onClick={() => {
                                                setSelectedArticle(article);
                                                setOpenModal(true);
                                            }}
                                        >
                                            جزئیات
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {articles?.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={10}
                                    >
                                        مقاله ای پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {articles.length !== 0 && (
                    <Pagination read={readArticles} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default Articles;
