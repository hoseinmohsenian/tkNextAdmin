import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateCategory from "../../../../components/AdminDashboard/Main/Content/Categories/CreateCategory/CreateCategory";
import Header from "../../../../components/Head/Head";

function NewsSubcategoriesCreatePage({ token }) {
    return (
        <div>
            <Header title="ایجاد دسته بندی اول | تیکا"></Header>
            <AdminDashboard>
                <CreateCategory
                    token={token}
                    title="ایجاد دسته بندی اول مقالات"
                    mainPage="/tkpanel/newsSubCategories"
                />
            </AdminDashboard>
        </div>
    );
}

export default NewsSubcategoriesCreatePage;

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

    return {
        props: { token },
    };
}
