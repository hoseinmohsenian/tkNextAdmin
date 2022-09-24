import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditArticle from "../../../../../components/AdminDashboard/Main/Content/Articles/EditArticle/EditArticle";
import Header from "../../../../../components/Head/Head";

function ArticlesPage({ token, languages, categoriesLevel1, article }) {
    return (
        <div>
            <Header title="ویرایش مقاله | تیکا"></Header>
            <AdminDashboard>
                <EditArticle
                    token={token}
                    languages={languages}
                    categoriesLevel1={categoriesLevel1}
                    article={article}
                />
            </AdminDashboard>
        </div>
    );
}

export default ArticlesPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const id = context.params.id;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/data/language`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/admin/blog/category?type=1`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/admin/blog/article/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            token,
            languages: dataArr[0]?.data,
            categoriesLevel1: dataArr[1].data,
            article: dataArr[2].data,
        },
    };
}
