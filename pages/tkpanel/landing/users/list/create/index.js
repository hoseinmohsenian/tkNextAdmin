import AdminDashboard from "../../../../../../components/AdminDashboard/Dashboard";
import CreateLanding from "../../../../../../components/AdminDashboard/Main/Content/Support/Landing/CreateLanding/CreateLanding";
import Header from "../../../../../../components/Head/Head";

function CreateLandingPage({ token }) {
    return (
        <div>
            <Header title="ایجاد لندینگ | تیکا"></Header>
            <AdminDashboard>
                <CreateLanding token={token} />
            </AdminDashboard>
        </div>
    );
}

export default CreateLandingPage;

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
        props: {
            token,
        },
    };
}
