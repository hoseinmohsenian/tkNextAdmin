import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateLevel from "../../../../components/AdminDashboard/Main/Content/CreateLevel/CreateLevel";
import Header from "../../../../components/Head/Head";

function CreateLevelPage() {
    return (
        <>
            <Header title="ایجاد سطح | تیکا"></Header>
            <AdminDashboard>
                <CreateLevel />
            </AdminDashboard>
        </>
    );
}

export default CreateLevelPage;

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
