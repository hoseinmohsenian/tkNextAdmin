import AdminDashboard from "../../../../../../components/AdminDashboard/Dashboard";
import CreatePagesList from "../../../../../../components/AdminDashboard/Main/Content/SitePages/SitePagesContent/Create/CreateContent";
import Header from "../../../../../../components/Head/Head";

function CreatePagesListPage({ token, page_id }) {
    return (
        <>
            <Header title="ایجاد محتوای صفحه | تیکا"></Header>
            <AdminDashboard>
                <CreatePagesList token={token} page_id={page_id} />
            </AdminDashboard>
        </>
    );
}

export default CreatePagesListPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const page_id = context.params.page_id;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    return { props: { token, page_id } };
}
