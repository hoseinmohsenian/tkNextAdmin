import AdminDashboard from "../../components/AdminDashboard/Dashboard";
import Header from "../../components/Head/Head";
import NotAuthorized from "../../components/Errors/NotAuthorized/NotAllowed";

function NotAuthorizedPage() {
    return (
        <div>
            <Header title="صفحه غیرمجاز | تیکا"></Header>
            <AdminDashboard>
                <NotAuthorized />
            </AdminDashboard>
        </div>
    );
}

export default NotAuthorizedPage;

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
