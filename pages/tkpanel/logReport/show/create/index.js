import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import CreateLog from "../../../../../components/AdminDashboard/Main/Content/SystemLogs/CreateLog/CreateLog";
import Header from "../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function CreateLogPage({
    statusList,
    admins,
    notAllowed,
    type,
    user_id,
    user_name,
    teacher_id,
    teacher_name,
    parent_id,
}) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="ایجاد لاگ | تیکا"></Header>
            <AdminDashboard>
                <CreateLog
                    statusList={statusList}
                    admins={admins}
                    type={type}
                    user_id={user_id}
                    user_name={user_name}
                    teacher_id={teacher_id}
                    teacher_name={teacher_name}
                    parent_id={parent_id}
                />
            </AdminDashboard>
        </>
    );
}

export default CreateLogPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const {
        type,
        user_id = "",
        user_name = "",
        teacher_id = "",
        teacher_name = "",
        parent_id = "",
    } = context.query;
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
        !["student", "teacher", "class"].includes(type) ||
        (type === "student" &&
            (!isKeyValid(user_id) || !isKeyValid(user_name))) ||
        (type === "teacher" &&
            (!isKeyValid(teacher_id) || !isKeyValid(teacher_name))) ||
        (type === "class" &&
            (!isKeyValid(user_id) ||
                !isKeyValid(user_name) ||
                !isKeyValid(teacher_id) ||
                !isKeyValid(teacher_name)))
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
            admins: dataArr[1].data,
            type,
            user_id,
            user_name,
            teacher_id,
            teacher_name,
            parent_id,
        },
    };
}
