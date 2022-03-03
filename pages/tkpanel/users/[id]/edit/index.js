import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditUser from "../../../../../components/AdminDashboard/Main/Content/Users/EditUser/EditUser";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function EditUserPage({ admin, token }) {
    return (
        <div>
            <Header title="ویرایش ادمین | تیکا"></Header>
            <AdminDashboard>
                <EditUser token={token} admin={admin} />
            </AdminDashboard>
        </div>
    );
}

export default EditUserPage;

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
        fetch(`${BASE_URL}/admin/action/return/${id}`, {
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
            admin: dataArr[0].data,
            token,
        },
    };
}
