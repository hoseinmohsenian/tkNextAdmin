import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import Header from "../../../../../components/Head/Head";
import TeacherStudentLogs from "../../../../../components/AdminDashboard/Main/Content/SystemLogs/TeacherStudentLogs/TeacherStudentLogs";
import { BASE_URL } from "../../../../../constants";

function STLogPage({ logs, type, token, id }) {
    return (
        <div>
            <Header
                title={`لاگ پیگیری ${
                    type === "student" ? "زبان آموز" : "استاد‌"
                } | تیکا`}
            ></Header>
            <AdminDashboard>
                <TeacherStudentLogs
                    fetchedLogs={logs}
                    type={type}
                    token={token}
                    id={id}
                />
            </AdminDashboard>
        </div>
    );
}

export default STLogPage;

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

    // Redirect if there's no "type" query or it's neither "student" nor "teacher"
    if (!isKeyValid(type) || (type !== "student" && type !== "teacher")) {
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

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            logs: dataArr[0].data,
            token,
            type,
            id,
        },
    };
}
