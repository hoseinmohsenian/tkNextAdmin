import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import TeacherIncome from "../../../../../components/AdminDashboard/Main/Content/Marketing/TeacherIncome/TeacherIncome";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";
import Header from "../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";

function TeacherIncomeDetailsPage({ token, chartData, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
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
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/marketing/teacher/income`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { chartData: dataArr[0].data, token },
    };
}
