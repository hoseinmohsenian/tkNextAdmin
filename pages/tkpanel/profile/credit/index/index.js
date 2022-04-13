import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import StudentManualTransaction from "../../../../../components/AdminDashboard/Main/Content/Accounting/StudentManualTransaction/StudentManualTransaction";
import Header from "../../../../../components/Head/Head";

function StudentManualTransactionPage({ token }) {
    return (
        <>
            <Header title="افزایش اعتبار زبان آموز | تیکا"></Header>
            <AdminDashboard>
                <StudentManualTransaction token={token} />
            </AdminDashboard>
        </>
    );
}

export default StudentManualTransactionPage;

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

    return { props: { token } };
}
