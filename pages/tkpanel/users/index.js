import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Users from "../../../components/AdminDashboard/Main/Content/Users/Users";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function UsersPage({ admins }) {
    return (
        <div>
            <Header title="کاربران | تیکا"></Header>
            <AdminDashboard>
                <Users admins={admins} />
            </AdminDashboard>
        </div>
    );
}

export default UsersPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/management/return`, {
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
            admins: dataArr[0].data,
        },
    };
}
