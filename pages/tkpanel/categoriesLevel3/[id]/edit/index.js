import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditCategory from "../../../../../components/AdminDashboard/Main/Content/Categories/EditCategory/EditCategory";
import Header from "../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function CategoriesLevel3EditPage({
    token,
    category,
    categoriesLevel1,
    notAllowed,
}) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="ویرایش دسته بندی سوم مقالات | تیکا"></Header>
            <AdminDashboard>
                <EditCategory
                    token={token}
                    category={category}
                    categoriesLevel1={categoriesLevel1}
                    title="ویرایش دسته بندی سوم مقالات"
                    mainPage="/tkpanel/categoriesLevel3"
                />
            </AdminDashboard>
        </div>
    );
}

export default CategoriesLevel3EditPage;

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
        fetch(`${BASE_URL}/admin/blog/category/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
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

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            token,
            category: dataArr[0].data,
            categoriesLevel1: dataArr[1].data,
        },
    };
}
