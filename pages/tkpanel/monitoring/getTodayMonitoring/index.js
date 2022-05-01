import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import DoneMonitoring from "../../../../components/AdminDashboard/Main/Content/Monitoring/DoneMonitoring/DoneMonitoring";
import Header from "../../../../components/Head/Head";

function DoneMonitoringPage({ token }) {
    return (
        <div>
            <Header title="مانیتورینگ انجام شده | تیکا"></Header>
            <AdminDashboard>
                <DoneMonitoring token={token} />
            </AdminDashboard>
        </div>
    );
}

export default DoneMonitoringPage;

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
        props: { token },
    };
}
