import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import Header from "../../../../../components/Head/Head";
import TeacherStudentLogs from "../../../../../components/AdminDashboard/Main/Content/SystemLogs/TeacherStudentLogs/TeacherStudentLogs";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function STLogPage({ logs, type, token, id, notAllowed, name }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header
                title={`لاگ پیگیری ${
                    type === "student" ? "زبان آموز" : "استاد‌"
                } ${name} | تیکا`}
            ></Header>
            <AdminDashboard>
                <TeacherStudentLogs
                    fetchedLogs={logs}
                    type={type}
                    token={token}
                    id={id}
                    name={name}
                />
            </AdminDashboard>
        </div>
    );
}

export default STLogPage;

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

    // Redirect if there's no "type" query or it's neither "student" nor "teacher"
    if (!isKeyValid(type) || !["student", "teacher"].includes(type)) {
        return {
            redirect: {
                destination: "/tkpanel",
                permanent: false,
            },
        };
    }

    let query = type === "student" ? `user_id` : "teacher_id";
    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/tracking-log?${query}=${id}`, {
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
            id,
            name: dataArr[0].meta,
        },
    };
}
