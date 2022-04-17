import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateCategory from "../../../../components/AdminDashboard/Main/Content/FAQ/Categires/CreateCategory/CreateCategory";
import Header from "../../../../components/Head/Head";

function FAQCreateCategoryPage({ token }) {
    return (
        <>
            <Header title="ایجاد دسته بندی FAQ | تیکا"></Header>
            <AdminDashboard>
                <CreateCategory token={token} />
            </AdminDashboard>
        </>
    );
}

export default FAQCreateCategoryPage;

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
        props: {
            token,
        },
    };
}
