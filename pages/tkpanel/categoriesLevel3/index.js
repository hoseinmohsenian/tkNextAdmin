import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import ShowCategories from "../../../components/AdminDashboard/Main/Content/Categories/ShowCategories";
import Header from "../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function CategoriesLevel3Page({ categories, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="دسته بندی سوم مقالات | تیکا"></Header>
            <AdminDashboard>
                <ShowCategories
                    fetchedCategories={categories}
                    title="لیست دسته بندی سوم مقالات"
                    createPage="/tkpanel/categoriesLevel3/create"
                    addressPage="/blog/c"
                    type={3}
                />
            </AdminDashboard>
        </div>
    );
}

export default CategoriesLevel3Page;

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
        fetch(`${BASE_URL}/admin/blog/category?type=3`, {
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
