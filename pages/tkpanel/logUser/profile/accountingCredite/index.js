import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import StudentManualTransactions from "../../../../../components/AdminDashboard/Main/Content/Accounting/StudentManualTransactions/StudentManualTransactions";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function StudentManualTransactionsPage({ transactions, token }) {
    return (
        <div>
            <Header title="لیست افزایش اعتبار دستی | تیکا"></Header>
            <AdminDashboard>
                <StudentManualTransactions
                    fetchedTransactions={transactions}
                    token={token}
                />
            </AdminDashboard>
        </div>
    );
}

export default StudentManualTransactionsPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const { page } = context?.query;
    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    let searchParams = "";

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            searchParams += `page=${page}`;
        }
    }

    const responses = await Promise.all([
        fetch(
            `${BASE_URL}/admin/accounting/student/manual/transactions?${searchParams}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        ),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { transactions: dataArr[0].data, token },
    };
}
