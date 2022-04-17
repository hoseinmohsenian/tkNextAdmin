import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import ClassroomChart from "../../../../../components/AdminDashboard/Main/Content/PrivateClass/ClassroomChart/ClassroomChart";
import Header from "../../../../../components/Head/Head";

function ClassroomChartPage({ token }) {
    return (
        <div>
            <Header title="ایجاد کلاس جدید | تیکا"></Header>
            <AdminDashboard>
                <ClassroomChart token={token} />
            </AdminDashboard>
        </div>
    );
}

export default ClassroomChartPage;

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
