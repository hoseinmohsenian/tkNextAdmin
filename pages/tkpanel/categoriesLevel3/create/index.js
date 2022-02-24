import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateCategory from "../../../../components/AdminDashboard/Main/Content/Categories/CreateCategory/CreateCategory";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function CategoriesLevel3CreatePage({ token, categoriesLevel1 }) {
    return (
        <div>
            <Header title="ایجاد دسته بندی سوم مقالات | تیکا"></Header>
            <AdminDashboard>
                <CreateCategory
                    token={token}
                    categoriesLevel1={categoriesLevel1}
                    title="ایجاد دسته بندی سوم مقالات"
                    mainPage="/tkpanel/categoriesLevel3"
                />
            </AdminDashboard>
        </div>
    );
}

export default CategoriesLevel3CreatePage;

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
        props: { token, categoriesLevel1: dataArr[0].data },
    };
}
