import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateUser from "../../../../components/AdminDashboard/Main/Content/Users/CreateUser/CreateUser";
import Header from "../../../../components/Head/Head";

function CreateUserPage({ token }) {
    return (
        <div>
            <Header title="ایجاد ادمین | تیکا"></Header>
            <AdminDashboard>
                <CreateUser token={token} />
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

    return {
        props: { token },
    };
}
