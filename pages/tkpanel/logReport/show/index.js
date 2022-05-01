import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import SystemLogs from "../../../../components/AdminDashboard/Main/Content/SystemLogs/SystemLogs";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function SystemLogPage({ logs }) {
    return (
        <div>
            <Header title="لاگ پیگیری | تیکا"></Header>
            <AdminDashboard>
                <SystemLogs fetchedLogs={logs} />
            </AdminDashboard>
        </div>
    );
}

export default SystemLogPage;

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

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/tracking-log`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { logs: dataArr[0].data },
    };
}
