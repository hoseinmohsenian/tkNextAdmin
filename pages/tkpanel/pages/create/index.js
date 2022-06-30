import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateSitePage from "../../../../components/AdminDashboard/Main/Content/SitePages/Create/CreateSitePage";
import Header from "../../../../components/Head/Head";

function CreateSitePagePage({ token }) {
    return (
        <>
            <Header title="ایجاد صفحه | تیکا"></Header>
            <AdminDashboard>
                <CreateSitePage token={token} />
            </AdminDashboard>
        </>
    );
}

export default CreateSitePagePage;

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

    return { props: { token } };
}
