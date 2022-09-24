import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import Header from "../../../../components/Head/Head";

function StudentDashboardPage() {
    return (
        <div>
            <Header title="هدایت به پنل زبان آموز | تیکا"></Header>
            <AdminDashboard>
                <h1>در حال انتقال به پنل زبان آموز</h1>
            </AdminDashboard>
        </div>
    );
}

export default StudentDashboardPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
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
        fetch(`${BASE_URL}/admin/student/create-token/${id}`, {
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
            destination: `${process.env.NEXT_PUBLIC_SITE_URL}/login-with-admin?token=${dataArr[0].data}&type=user`,
            permanent: false,
        },
    };
}
