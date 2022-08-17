import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import TeacherReporting from "../../../../components/AdminDashboard/Main/Content/Reporting/TeacherReporting/TeacherReporting";
import Header from "../../../../components/Head/Head";

function ArticlesPage() {
    return (
        <div>
            <Header title="گزارش گیری استاد | تیکا"></Header>
            <AdminDashboard>
                <TeacherReporting />
            </AdminDashboard>
        </div>
    );
}

export default ArticlesPage;

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
