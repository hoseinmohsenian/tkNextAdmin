import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateLanguage from "../../../../components/AdminDashboard/Main/Content/CreateLanguage/CreateLanguage";
import Header from "../../../../components/Head/Head";

function CreateLanguagePage({ token }) {
    return (
        <>
            <Header title="ایجاد زبان | تیکا"></Header>
            <AdminDashboard>
                <CreateLanguage token={token} />
            </AdminDashboard>
        </>
    );
}

export default CreateLanguagePage;

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

    return { props: { token } };
}
