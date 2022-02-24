import { useState } from "react";
import cstyles from "./Articles.module.css";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "jalali-moment";
import Box from "../Elements/Box/Box";

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
    const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const router = useRouter();
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

    const readArticles = async (page = 1) => {
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
        Object.keys(filters).forEach((key) => {
            if (Number(filters[key]) !== 0) {
                if (key === "draft" && filters["draft"]) {
                    searchQuery += `draft=1&`;
                } else {
                    searchQuery += `${key}=${filters[key]}&`;
                }
            }
        });
        searchQuery += `page=${page}`;

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
                await readArticles();
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting article", error);
        }
    };

    return (
        <div>
            <Box
                title="لیست مقالات"
                buttonInfo={{
                    name: "ایجاد مقاله",
                    url: "/tkpanel/siteNews/create",
                    color: "primary",
                }}
            >
                <div className={cstyles["search"]}>
                    <form className={cstyles.form}>
                        <div className={`row ${cstyles["search-row"]}`}>
                            <div
                                className={`col-sm-6 ${cstyles["search-col"]}`}
                            >
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="language_id"
                                        className={`form__label ${cstyles["search-label"]}`}
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
                            <div
                                className={`col-sm-6 ${cstyles["search-col"]}`}
                            >
                                <div className="input-wrapper">
                                    <label
                                        htmlFor="admin_id"
                                        className={`form__label ${cstyles["search-label"]}`}
                                    >
                                        ادمین :
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

                        <div className={`row ${cstyles["search-row"]}`}>
                            <div
                                className={`col-sm-6 ${cstyles["search-col"]}`}
                            >
                                <div
                                    className={`input-wrapper ${cstyles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="title"
                                        className={`form__label ${cstyles["search-label"]}`}
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
                            <div
                                className={`col-sm-6 ${cstyles["search-col"]}`}
                            >
                                <div
                                    className={`input-wrapper ${cstyles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="draft"
                                        className={`form__label ${cstyles["search-label"]}`}
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

                        <div className={`row ${cstyles["search-row"]}`}>
                            <div
                                className={`col-sm-12 ${cstyles["search-col"]}`}
                            >
                                <div
                                    className={`input-wrapper ${cstyles["search-input-wrapper"]}`}
                                >
                                    <label
                                        htmlFor="draft"
                                        className={`form__label ${cstyles["search-label"]}`}
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

                        <div className={cstyles["btn-wrapper"]}>
                            <button
                                type="button"
                                className={`btn primary ${cstyles["btn"]}`}
                                disabled={loading}
                                onClick={() => readArticles()}
                            >
                                {loading ? "در حال انجام ..." : "اعمال فیلتر"}
                            </button>
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
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">عنوان</th>
                                <th className="table__head-item">url</th>
                                <th className="table__head-item">زبان</th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">نوع</th>
                                <th className="table__head-item">پین</th>
                                <th className="table__head-item">
                                    نام نویسنده
                                </th>
                                <th className="table__head-item">
                                    تاریخ ایجاد
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
                                    <td className="table__body-item">
                                        {article?.title}
                                    </td>
                                    <td
                                        className="table__body-item"
                                        style={{
                                            direction: "ltr",
                                            textAlign: "right",
                                        }}
                                    >
                                        {article?.url}
                                    </td>
                                    <td className="table__body-item">
                                        {article?.language_id}
                                    </td>
                                    <td className="table__body-item">
                                        {article?.draft === 1
                                            ? "پیش نویس"
                                            : "منتشر شده"}
                                    </td>
                                    <td className="table__body-item">
                                        {article?.type === 1
                                            ? "ویدئو"
                                            : "استاندارد"}
                                    </td>
                                    <td className="table__body-item">
                                        {article?.pin === 1
                                            ? "پین شده"
                                            : "پین نشده"}
                                    </td>
                                    <td className="table__body-item">
                                        {article?.admin_id}
                                    </td>
                                    <td
                                        className="table__body-item"
                                        style={{
                                            direction: "ltr",
                                            textAlign: "right",
                                        }}
                                    >
                                        {/* {moment(article?.created_at).format(
                                        "YYYY/MM/DD hh:mm:ss"
                                    )} */}
                                        {article?.created_at}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() =>
                                                deleteArticle(article?.id, i)
                                            }
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
                                            href={`/blog${article?.url}`}
                                            disabled={loadings[i]}
                                        >
                                            <a className={`action-btn primary`}>
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

                {articles && (
                    <Pagination read={readArticles} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default Articles;
