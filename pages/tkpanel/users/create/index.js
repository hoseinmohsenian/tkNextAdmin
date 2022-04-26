import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateUser from "../../../../components/AdminDashboard/Main/Content/Users/CreateUser/CreateUser";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function CreateUserPage({ token, permissions }) {
    return (
        <div>
            <Header title="ایجاد ادمین | تیکا"></Header>
            <AdminDashboard>
                <CreateUser token={token} permissions={permissions} />
            </AdminDashboard>
        </div>
    );
}

export default CreateUserPage;

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
        fetch(`${BASE_URL}/admin/management/permissions`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { token, permissions: dataArr[0].data },
    };
}
