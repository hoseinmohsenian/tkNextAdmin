import AdminDashboard from "../../../../../../components/AdminDashboard/Dashboard";
import ChildrenLogs from "../../../../../../components/AdminDashboard/Main/Content/SystemLogs/ChildrenLogs/ChildrenLogs";
import Header from "../../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../../components/Errors/NotAuthorized/NotAllowed";

function EditLogPage({ logs, token, type, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="لاگ های فرزند | تیکا"></Header>
            <AdminDashboard>
                <ChildrenLogs token={token} logs={logs} type={type} />
            </AdminDashboard>
        </>
    );
}

export default EditLogPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const id = context.params.id;
    const { type } = context.query;
    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    // Redirect if there's no "type" query or it's not "student" or "teacher" or "class"
    if (!isKeyValid(type) || !["student", "teacher", "class"].includes(type)) {
        return {
            redirect: {
                destination: "/tkpanel",
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

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            logs: dataArr[0].data,
            token,
            type,
        },
    };
}
