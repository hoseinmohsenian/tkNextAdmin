import AdminDashboard from "../../../../../../components/AdminDashboard/Dashboard";
import ChildrenLogs from "../../../../../../components/AdminDashboard/Main/Content/SystemLogs/ChildrenLogs/ChildrenLogs";
import Header from "../../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../../constants";

function EditLogPage({ logs, token }) {
    return (
        <>
            <Header title="لاگ های فرزند | تیکا"></Header>
            <AdminDashboard>
                <ChildrenLogs token={token} logs={logs} />
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
        fetch(`${BASE_URL}/admin/tracking-log/child/${id}`, {
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
            logs: dataArr[0].data,
            token,
        },
    };
}
