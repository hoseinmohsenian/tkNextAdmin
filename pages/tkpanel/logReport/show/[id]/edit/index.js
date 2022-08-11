import AdminDashboard from "../../../../../../components/AdminDashboard/Dashboard";
import EditLog from "../../../../../../components/AdminDashboard/Main/Content/SystemLogs/EditLog/EditLog";
import Header from "../../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../../constants";
import { checkResponseArrAuth } from "../../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../../components/Errors/NotAuthorized/NotAllowed";

function EditLogPage({ statusList, theLog, admins, notAllowed, type }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="ویرایش لاگ | تیکا"></Header>
            <AdminDashboard>
                <EditLog
                    statusList={statusList}
                    theLog={theLog}
                    admins={admins}
                    type={type}
                />
            </AdminDashboard>
        </>
    );
}

export default EditLogPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
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

    // Redirect if there's no "type" or "id" or "name" query or it's neither "student" nor "teacher"
    if (
        !isKeyValid(type) ||
        (type !== "student" && type !== "teacher" && type !== "class")
    ) {
        return {
            redirect: {
                destination: "/tkpanel",
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
    ]);

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            statusList: dataArr[0].data,
            theLog: dataArr[1].data,
            admins: dataArr[2].data,
            type,
        },
    };
}
