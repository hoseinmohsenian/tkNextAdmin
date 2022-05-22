import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import TikkaaIncome from "../../../../../components/AdminDashboard/Main/Content/Accounting/TikkaaIncome/TikkaaIncome";
import Header from "../../../../../components/Head/Head";

function TikkaaIncomeDetailsPage({ token }) {
    return (
        <div>
            <Header title="جزئیات درآمد تیکا | تیکا"></Header>
            <AdminDashboard>
                <TikkaaIncome token={token} />
            </AdminDashboard>
        </div>
    );
}

export default TikkaaIncomeDetailsPage;

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
        props: { token },
    };
}
