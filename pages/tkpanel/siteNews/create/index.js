import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateArticle from "../../../../components/AdminDashboard/Main/Content/Articles/CreateArticle/CreateArticle";
import Header from "../../../../components/Head/Head";

function ArticlesPage({ token, languages, categoriesLevel1 }) {
    return (
        <div>
            <Header title="مقاله جدید | تیکا"></Header>
            <AdminDashboard>
                <CreateArticle
                    token={token}
                    languages={languages}
                    categoriesLevel1={categoriesLevel1}
                />
            </AdminDashboard>
        </div>
    );
}

export default ArticlesPage;

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
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            token,
            languages: dataArr[0]?.data,
            categoriesLevel1: dataArr[1].data,
        },
    };
}
