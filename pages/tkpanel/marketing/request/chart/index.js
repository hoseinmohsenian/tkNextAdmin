import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import ClassroomChart from "../../../../../components/AdminDashboard/Main/Content/Marketing/ClassroomChart/ClassroomChart";
import Header from "../../../../../components/Head/Head";

function ClassroomChartPage() {
    return (
        <div>
            <Header title="نمودار ثبت کلاس | تیکا"></Header>
            <AdminDashboard>
                <ClassroomChart />
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
        props: {},
    };
}
