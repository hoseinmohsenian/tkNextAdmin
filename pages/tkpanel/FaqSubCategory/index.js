import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import SubCategories from "../../../components/AdminDashboard/Main/Content/FAQ/SubCategories/SubCategories";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function FAQSubCategoryPage({ categories, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="لیست زیرگروه دسته بندی FAQ | تیکا"></Header>
            <AdminDashboard>
                <SubCategories categories={categories} />
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

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            categories: dataArr[0].data,
        },
    };
}
