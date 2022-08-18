import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateTeam from "../../../../components/AdminDashboard/Main/Content/OurTeam/CreateTeam/CreateTeam";
import Header from "../../../../components/Head/Head";

function CreateTeamPage() {
    return (
        <>
            <Header title="ایجاد عضو | تیکا"></Header>
            <AdminDashboard>
                <CreateTeam />
            </AdminDashboard>
        </>
    );
}

export default CreateTeamPage;

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

    return { props: {} };
}
