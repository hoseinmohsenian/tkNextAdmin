import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditSubCategory from "../../../../../components/AdminDashboard/Main/Content/FAQ/SubCategories/EditSubCategory/EditSubCategory";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function FAQCreateEditPage({ token, category, categories }) {
    return (
        <>
            <Header title="ویرایش زیرگروه دسته بندی FAQ | تیکا"></Header>
            <AdminDashboard>
                <EditSubCategory
                    token={token}
                    category={category}
                    categories={categories}
                />
            </AdminDashboard>
        </>
    );
}

export default FAQCreateEditPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
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
        fetch(`${BASE_URL}/admin/faq/category/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
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
            category: dataArr[0].data,
            categories: dataArr[1].data,
            token,
        },
    };
}
