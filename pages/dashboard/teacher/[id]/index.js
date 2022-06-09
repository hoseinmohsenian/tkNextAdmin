import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function TeacherDashboardPage() {
    return (
        <div>
            <Header title="هدایت به پنل استاد | تیکا"></Header>
            <AdminDashboard>
                <h1>در حال انتقال به پنل استاد</h1>
            </AdminDashboard>
        </div>
    );
}

export default TeacherDashboardPage;

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
        fetch(`${BASE_URL}/admin/teacher/create-token/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        redirect: {
            destination: `https://barmansms.ir/login-with-admin?token=${dataArr[0].data}&type=teacher`,
            permanent: false,
        },
    };
}
