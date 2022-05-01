import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import StatusList from "../../../../components/AdminDashboard/Main/Content/SystemLogs/StatusList/StatusList";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function SystemLogStatusPage({ statusList }) {
    return (
        <div>
            <Header title="وضیعت های پیگیری | تیکا"></Header>
            <AdminDashboard>
                <StatusList statusData={statusList} />
            </AdminDashboard>
        </div>
    );
}

export default SystemLogStatusPage;

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
        fetch(`${BASE_URL}/admin/tracking-log/status`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { statusList: dataArr[0].data },
    };
}
