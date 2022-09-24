import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import Header from "../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";
import ArticleComments from "../../../../components/AdminDashboard/Main/Content/ArticleComments/ArticleComments";

function CommentsPage({ comments, notAllowed, searchData }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="کامنت مقالات | تیکا"></Header>
            <AdminDashboard>
                <ArticleComments
                    fetchedComments={comments}
                    searchData={searchData}
                />
            </AdminDashboard>
        </div>
    );
}

export default CommentsPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    const isKeyValid = (key) => key !== undefined;
    const { article_title, order_by, status, page } = context?.query;
    let searchData = {
        article_title: "",
        order_by: "desc",
        status: "both",
    };
    let searchQuery = "";

    if (isKeyValid(article_title)) {
        searchQuery += `article_title=${article_title}&`;
        searchData = { ...searchData, article_title: article_title };
    }
    if (isKeyValid(order_by) && ["desc", "asc"].includes(order_by)) {
        searchQuery += `order_by=${order_by}&`;
        searchData = { ...searchData, order_by: order_by };
    } else {
        searchQuery += `order_by=desc&`;
        searchData = { ...searchData, order_by: "desc" };
    }
    if (isKeyValid(status)) {
        searchQuery += `status=${status}&`;
        searchData = { ...searchData, status: status };
    }
    if (isKeyValid(page)) {
        searchQuery += `page=${page}&`;
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/blog/article/detail/comment?${searchQuery}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { comments: dataArr[0]?.data, searchData },
    };
}
