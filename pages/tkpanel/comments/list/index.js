import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";
import ArticleComments from "../../../../components/AdminDashboard/Main/Content/ArticleComments/ArticleComments";

function CommentsPage({ comments, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="کامنت مقالات | تیکا"></Header>
            <AdminDashboard>
                <ArticleComments fetchedComments={comments} />
            </AdminDashboard>
        </div>
    );
}

export default CommentsPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/blog/article/detail/comment`, {
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
        props: { comments: dataArr[0]?.data },
    };
}
