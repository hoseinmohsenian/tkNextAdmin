import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateScore from "../../../../components/AdminDashboard/Main/Content/TeacherSide/TeachersScore/CreateScore/CreateScore";
import Header from "../../../../components/Head/Head";

function TeachersCreateScorePage() {
    return (
        <>
            <Header title="ایجاد امتیاز برای استاد | تیکا"></Header>
            <AdminDashboard>
                <CreateScore />
            </AdminDashboard>
        </>
    );
}

export default TeachersCreateScorePage;

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
        props: {},
    };
}
