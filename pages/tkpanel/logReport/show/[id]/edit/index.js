import AdminDashboard from "../../../../../../components/AdminDashboard/Dashboard";
import EditLog from "../../../../../../components/AdminDashboard/Main/Content/SystemLogs/EditLog/EditLog";
import Header from "../../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../../constants";

function EditLogPage({ statusList, token, theLog, admins, logs }) {
    return (
        <>
            <Header title="ویرایش لاگ | تیکا"></Header>
            <AdminDashboard>
                <EditLog
                    statusList={statusList}
                    token={token}
                    theLog={theLog}
                    admins={admins}
                    logs={logs}
                />
            </AdminDashboard>
        </>
    );
}

export default EditLogPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const id = context.params.id;

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
        fetch(`${BASE_URL}/admin/tracking-log/${id}`, {
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
            theLog: dataArr[1].data,
            admins: dataArr[2].data,
            logs: dataArr[3].data,
            token,
        },
    };
}
