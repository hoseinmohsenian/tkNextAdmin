import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import CreateStatus from "../../../../../components/AdminDashboard/Main/Content/SystemLogs/StatusList/CreateStatus/CreateStatus";
import Header from "../../../../../components/Head/Head";

function CreateSystemLogStatusPage() {
    return (
        <div>
            <Header title="ایجاد وضیعت پیگیری | تیکا"></Header>
            <AdminDashboard>
                <CreateStatus />
            </AdminDashboard>
        </div>
    );
}

export default CreateSystemLogStatusPage;

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
        props: {},
    };
}
