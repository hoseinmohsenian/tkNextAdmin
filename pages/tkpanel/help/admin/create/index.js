import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import CreateHelp from "../../../../../components/AdminDashboard/Main/Content/Help/CreateHelp/CreateHelp";
import Header from "../../../../../components/Head/Head";

function CreateHelpPage({ token }) {
    return (
        <div>
            <Header title="ایجاد راهنما | تیکا"></Header>
            <AdminDashboard>
                <CreateHelp token={token} />
            </AdminDashboard>
        </div>
    );
}

export default CreateHelpPage;

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
