import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateSemiPrivate from "../../../../components/AdminDashboard/Main/Content/SemiPrivate/Create/Create";
import Header from "../../../../components/Head/Head";

function GroupClassPage({ token }) {
    return (
        <>
            <Header title="کلاس نیمه خصوصی جدید |‌ تیکا"></Header>
            <AdminDashboard>
                <CreateSemiPrivate token={token} />
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
