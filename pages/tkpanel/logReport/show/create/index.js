import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import CreateLog from "../../../../../components/AdminDashboard/Main/Content/SystemLogs/CreateLog/CreateLog";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function CreateLogPage({ statusList, token, admins, logs }) {
    return (
        <>
            <Header title="ایجاد لاگ | تیکا"></Header>
            <AdminDashboard>
                <CreateLog
                    statusList={statusList}
                    token={token}
                    admins={admins}
                    logs={logs}
                />
            </AdminDashboard>
        </>
    );
}

export default CreateLogPage;

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
        fetch(`${BASE_URL}/admin/tracking-log/status/return/active`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/admin/management/return`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
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
        props: {
            statusList: dataArr[0].data,
            admins: dataArr[1].data,
            logs: dataArr[2].data,
            token,
        },
    };
}
