import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateSubCategory from "../../../../components/AdminDashboard/Main/Content/FAQ/SubCategories/CreateSubCategory/CreateSubCategory";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function FAQCreateSubCategoryPage({ categories }) {
    return (
        <>
            <Header title="ایجاد زیرگروه دسته بندی FAQ | تیکا"></Header>
            <AdminDashboard>
                <CreateSubCategory categories={categories} />
            </AdminDashboard>
        </>
    );
}

export default FAQCreateSubCategoryPage;

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
