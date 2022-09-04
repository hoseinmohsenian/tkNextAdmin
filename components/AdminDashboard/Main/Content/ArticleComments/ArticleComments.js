import { useState } from "react";
import Link from "next/link";
import Alert from "../../../../Alert/Alert";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import API from "../../../../../api/index";
import moment from "jalali-moment";
import { AiFillEye } from "react-icons/ai";
import styles from "./ArticleComments.module.css";

const filtersSchema = { article_title: "" };
const appliedFiltersSchema = { article_title: false };

function ArticleComments({
    fetchedComments: { data, ...restData },
    searchData,
}) {
    const [comments, setComments] = useState(data);
    const [pagData, setPagData] = useState(restData);
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
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
    moment.locale("fa", { useGregorianParser: true });

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    const readComments = async (page = 1, avoidFilters = false) => {
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
                    searchParams = { ...searchParams, [key]: filters[key] };
                } else {
                    tempFilters[key] = false;
                }
            });
            setAppliedFilters(tempFilters);
        }
        searchQuery += `page=${page}`;

        router.push({
            pathname: `/tkpanel/comments/list`,
            query: searchParams,
        });

        try {
            setLoading(true);
            const { data, status, response } = await API.get(
                `/admin/blog/article/detail/comment?${searchQuery}`
            );

            if (status === 200) {
                const { data: listData, ...restData } = data?.data;
                setComments(listData);
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
            setLoading(false);
        } catch (error) {
            console.log("Error reading comments", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const changeStatus = async (comment_id, status, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const { response, status: apiStatus } = await API.post(
                `/admin/blog/article/detail/comment/${comment_id}`,
                JSON.stringify({ status: status === 0 ? 1 : 0 })
            );

            if (apiStatus === 200) {
                let message = `این کامنت ${
                    status === 0 ? "فعال" : "غیرفعال"
                } شد`;
                showAlert(true, status === 0 ? "success" : "danger", message);
                let updated = [...comments];
                updated[i] = { ...updated[i], status: status === 0 ? 1 : 0 };
                setComments(() => updated);
            } else {
                showAlert(
                    true,
                    "warning",
                    response?.data?.error?.invalid_params[0]?.message ||
                        "مشکلی پیش آمده"
                );
            }

            temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error changing status", error);
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

    const removeFilters = () => {
        setFilters(filtersSchema);
        setAppliedFilters(appliedFiltersSchema);
        readComments(1, true);
        router.push({
            pathname: `/tkpanel/comments/list`,
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
        await readComments();
    };

    return (
        <div>
            <Box title="لیست کامنت مقالات">
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
                                        htmlFor="article_title"
                                        className={`form__label`}
                                    >
                                        عنوان مقاله :
                                    </label>
                                    <div
                                        className="form-control"
                                        style={{ margin: 0 }}
                                    >
                                        <input
                                            type="article_title"
                                            name="article_title"
                                            id="article_title"
                                            className="form__input"
                                            onChange={filtersOnChangeHandler}
                                            value={filters?.article_title}
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

                <div className="table__wrapper table__wrapper--wrap">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th
                                    className="table__head-item"
                                    style={{ width: 120 }}
                                >
                                    نام کاربر
                                </th>
                                <th className="table__head-item">
                                    موضوع مقاله
                                </th>
                                <th className="table__head-item">کامنت</th>
                                <th className="table__head-item">تاریخ ثبت</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {comments?.map((comment, i) => (
                                <tr
                                    className="table__body-row"
                                    key={comment.id}
                                >
                                    <td className="table__body-item">
                                        {comment.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        {comment.article_header}
                                        <Link
                                            href={`${SITE_URL}/blog/${comment.article_url}`}
                                        >
                                            <a
                                                target="_blank"
                                                style={{ marginRight: 5 }}
                                            >
                                                <AiFillEye fontSize={20} />
                                            </a>
                                        </Link>
                                    </td>
                                    <td className="table__body-item">
                                        {comment.comment}
                                    </td>
                                    <td className="table__body-item">
                                        {comment?.created_at
                                            ? moment(
                                                  comment?.created_at
                                              ).format("YYYY/MM/DD hh:mm")
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                comment.status === 0
                                                    ? "primary"
                                                    : "danger"
                                            }`}
                                            onClick={() =>
                                                changeStatus(
                                                    comment.id,
                                                    comment.status,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            {comment?.status === 0
                                                ? "فعال"
                                                : "غیرفعال"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        {comments?.length === 0 && (
                            <tr className="table__body-row">
                                <td className="table__body-item" colSpan={5}>
                                    کانتی پیدا نشد !
                                </td>
                            </tr>
                        )}
                    </table>
                </div>

                {comments.length !== 0 && (
                    <Pagination read={readComments} pagData={pagData} />
                )}
            </Box>

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={changeStatus}
            />
        </div>
    );
}

export default ArticleComments;
