import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateCourse from "../../../../components/AdminDashboard/Main/Content/Courses/CreateCourse/CreateCourse";
import Header from "../../../../components/Head/Head";

function CreateCoursePage({ token }) {
    return (
        <>
            <Header title="ایجاد کورس | تیکا"></Header>
            <AdminDashboard>
                <CreateCourse token={token} />
            </AdminDashboard>
        </>
    );
}

export default CreateCoursePage;

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
