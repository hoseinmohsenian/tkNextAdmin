import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import TeacherIncome from "../../../../../components/AdminDashboard/Main/Content/Accounting/TeacherIncome/TeacherIncome";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function TeacherIncomeDetailsPage({ token, chartData }) {
    return (
        <div>
            <Header title="جزئیات درآمد اساتید | تیکا"></Header>
            <AdminDashboard>
                <TeacherIncome token={token} chartData={chartData} />
            </AdminDashboard>
        </div>
    );
}

export default TeacherIncomeDetailsPage;

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
        fetch(`${BASE_URL}/admin/accounting/teacher/income`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { chartData: dataArr[0].data, token },
    };
}
