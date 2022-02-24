import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Users from "../../../components/AdminDashboard/Main/Content/Users/Users";
import Header from "../../../components/Head/Head";

function AdminLoginPage() {
    return (
        <div>
            <Header title="کاربران | تیکا"></Header>
            <AdminDashboard>
                <Users />
            </AdminDashboard>
        </div>
    );
}

export default AdminLoginPage;

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
