import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateUser from "../../../../components/AdminDashboard/Main/Content/CreateUser/CreateUser";
import Header from "../../../../components/Head/Head";

function AdminLoginPage() {
    return (
        <div>
            <Header title="ایجاد ادمین | تیکا"></Header>
            <AdminDashboard>
                <CreateUser />
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
