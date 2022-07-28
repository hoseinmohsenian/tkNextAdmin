import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import ShowCategories from "../../../components/AdminDashboard/Main/Content/Categories/ShowCategories";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function NewsSubcategoriesPage({ categories, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="دسته بندی اول مقالات | تیکا"></Header>
            <AdminDashboard>
                <ShowCategories
                    fetchedCategories={categories}
                    title="لیست دسته بندی اول مقالات"
                    createPage="/tkpanel/newsSubCategories/create"
                    addressPage="/blog/c"
                    type={1}
                />
            </AdminDashboard>
        </div>
    );
}

export default NewsSubcategoriesPage;

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
    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }
    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { categories: dataArr[0]?.data },
    };
}
