import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import TeacherTransactionDetails from "../../../../components/AdminDashboard/Main/Content/Accounting/TeacherTransactionDetails/TeacherTransactionDetails";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function TeacherTransactionDetailsPage({ transactions, token }) {
    return (
        <div>
            <Header title="جزئیات پرداختی برای استاد | تیکا"></Header>
            <AdminDashboard>
                <TeacherTransactionDetails
                    fetchedTransactions={transactions}
                    token={token}
                />
            </AdminDashboard>
        </div>
    );
}

export default TeacherTransactionDetailsPage;

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
        fetch(`${BASE_URL}/admin/accounting/teacher/transactions`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { transactions: dataArr[0].data, token },
    };
}
