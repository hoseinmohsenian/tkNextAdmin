import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import MultiSession from "../../../components/AdminDashboard/Main/Content/MultiSession/MultiSession";
import Header from "../../../components/Head/Head";

function MultiSessionPage({ token }) {
    return (
        <div>
            <Header title="۵ جلسه ۱۰ جلسه | تیکا"></Header>
            <AdminDashboard>
                <MultiSession token={token} />
            </AdminDashboard>
        </div>
    );
}

export default MultiSessionPage;

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
