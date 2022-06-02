import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreatePlatform from "../../../../components/AdminDashboard/Main/Content/CreatePlatform/CreatePlatform";
import Header from "../../../../components/Head/Head";

function CreatePlatformPage({ token }) {
    return (
        <>
            <Header title="پلتفرم جدید | تیکا"></Header>
            <AdminDashboard>
                <CreatePlatform token={token} />
            </AdminDashboard>
        </>
    );
}

export default CreatePlatformPage;

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
