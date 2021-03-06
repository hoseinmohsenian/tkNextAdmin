import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import SubCategories from "../../../components/AdminDashboard/Main/Content/FAQ/SubCategories/SubCategories";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function FAQSubCategoryPage({ token, categories }) {
    return (
        <>
            <Header title="لیست زیرگروه دسته بندی FAQ | تیکا"></Header>
            <AdminDashboard>
                <SubCategories token={token} categories={categories} />
            </AdminDashboard>
        </>
    );
}

export default FAQSubCategoryPage;

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
            token,
            categories: dataArr[0].data,
        },
    };
}
