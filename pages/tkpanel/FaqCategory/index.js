import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Categories from "../../../components/AdminDashboard/Main/Content/FAQ/Categires/Categires";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function FAQCategoriesPage({ categories }) {
    return (
        <>
            <Header title="دسته بندی FAQ | تیکا"></Header>
            <AdminDashboard>
                <Categories categories={categories} />
            </AdminDashboard>
        </>
    );
}

export default FAQCategoriesPage;

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
        fetch(`${BASE_URL}/admin/faq/category`, {
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
            categories: dataArr[0].data,
        },
    };
}
