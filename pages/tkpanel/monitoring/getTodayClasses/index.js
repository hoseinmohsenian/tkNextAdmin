import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import TodayMonitoring from "../../../../components/AdminDashboard/Main/Content/Monitoring/TodayMonitoring/TodayMonitoring";
import Header from "../../../../components/Head/Head";

function TodayMonitoringPage({ token }) {
    return (
        <div>
            <Header title="مانیتورینگ امروز | تیکا"></Header>
            <AdminDashboard>
                <TodayMonitoring token={token} />
            </AdminDashboard>
        </div>
    );
}

export default TodayMonitoringPage;

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
