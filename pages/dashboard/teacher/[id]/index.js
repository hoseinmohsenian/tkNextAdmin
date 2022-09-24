import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import Header from "../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function TeacherDashboardPage({ notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
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
        fetch(`${BASE_URL}/admin/teacher/create-token/${id}`, {
            method: "POST",
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
        redirect: {
            destination: `${process.env.NEXT_PUBLIC_SITE_URL}/login-with-admin?token=${dataArr[0].data}&type=teacher&step=${context.query?.step}`,
            permanent: false,
        },
    };
}
