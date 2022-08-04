import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import MultiSession from "../../../components/AdminDashboard/Main/Content/Support/MultiSession/MultiSession";
import Header from "../../../components/Head/Head";

function MultiSessionPage() {
    return (
        <div>
            <Header title="۵ جلسه ۱۰ جلسه | تیکا"></Header>
            <AdminDashboard>
                <MultiSession />
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
        props: {},
    };
}
