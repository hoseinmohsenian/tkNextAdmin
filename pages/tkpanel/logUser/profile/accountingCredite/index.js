import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import StudentManualTransactions from "../../../../../components/AdminDashboard/Main/Content/Accounting/StudentManualTransactions/StudentManualTransactions";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function StudentManualTransactionsPage({
    transactions,
    token,
    notAllowed,
    searchData,
}) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="لیست افزایش اعتبار دستی | تیکا"></Header>
            <AdminDashboard>
                <StudentManualTransactions
                    fetchedTransactions={transactions}
                    token={token}
                    searchData={searchData}
                />
            </AdminDashboard>
        </div>
    );
}

export default StudentManualTransactionsPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const { page, user_name, user_mobile } = context?.query;
    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    let searchData = {
        user_name: "",
        user_mobile: "",
    };
    let searchParams = "";

    if (isKeyValid(user_name)) {
        searchParams += `user_name=${user_name}&`;
        searchData = { ...searchData, user_name: user_name };
    }
    if (isKeyValid(user_mobile)) {
        searchParams += `user_mobile=${user_mobile}&`;
        searchData = { ...searchData, user_mobile: user_mobile };
    }

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

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { transactions: dataArr[0].data, token, searchData },
    };
}
