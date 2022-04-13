import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import ClassroomChart from "../../../../../components/AdminDashboard/Main/Content/PrivateClass/ClassroomChart/ClassroomChart";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function ClassroomChartPage({ token, admins }) {
    return (
        <div>
            <Header title="ایجاد کلاس جدید | تیکا"></Header>
            <AdminDashboard>
                <ClassroomChart token={token} admins={admins} />
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

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/management/return`, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            token,
            admins: dataArr[0].data,
        },
    };
}
