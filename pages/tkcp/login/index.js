import AdminLogin from "../../../components/AdminLogin/AdminLogin";
import Header from "../../../components/Head/Head";

function AdminLoginPage() {
    return (
        <div>
            <Header title="لاگین ادمین | تیکا"></Header>
            <AdminLogin />
        </div>
    );
}

export default AdminLoginPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];

    if (token) {
        return {
            redirect: {
                destination: "/tkpanel",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}
