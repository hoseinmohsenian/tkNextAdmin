import { useState } from "react";
import Link from "next/link";
import Alert from "../../../../Alert/Alert";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import API from "../../../../../api/index";

function ArticleComments({ fetchedComments: { data, ...restData } }) {
    const [comments, setComments] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const router = useRouter();

    const handleOnChange = (e) => {
        const type = e.target.type;
        const name = e.target.name;
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        setFilters((oldFilters) => {
            return { ...oldFilters, [name]: value };
        });
    };

    const readComments = async (page = 1, avoidFilters = false) => {
        // Constructing search parameters
        let searchQuery = "";
        searchQuery += `page=${page}`;

        router.push({
            pathname: `/tkpanel/comments/list`,
            query: { page },
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

    return (
        <div>
            <Box title="لیست کامنت مقالات">
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
                                    </td>
                                    <td className="table__body-item">
                                        {comment.comment}
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
