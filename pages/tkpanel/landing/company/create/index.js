import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import CreateCompanyLanding from "../../../../../components/AdminDashboard/Main/Content/Marketing/Landing/Company/Create/CreateCompanyLanding";
import Header from "../../../../../components/Head/Head";

function CreateCompanyLandingPage({ token }) {
    return (
        <>
            <Header title="ایجاد لندینگ شرکتی | تیکا"></Header>
            <AdminDashboard>
                <CreateCompanyLanding token={token} />
            </AdminDashboard>
        </>
    );
}

export default CreateCompanyLandingPage;

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
