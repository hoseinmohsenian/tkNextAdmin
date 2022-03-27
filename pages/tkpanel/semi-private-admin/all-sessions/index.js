import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import SemiPrivateSessions from "../../../../components/AdminDashboard/Main/Content/SemiPrivate/Sessions/Sessions";
import Header from "../../../../components/Head/Head";

function GroupClassPage({ token }) {
    return (
        <>
            <Header title="جلسات کلاس های نیمه خصوصی | تیکا"></Header>
            <AdminDashboard>
                <SemiPrivateSessions token={token} />
            </AdminDashboard>
        </>
    );
}

export default GroupClassPage;

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
