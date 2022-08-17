import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import TeacherManualTransaction from "../../../../components/AdminDashboard/Main/Content/Accounting/TeacherManualTransaction/TeacherManualTransaction";
import Header from "../../../../components/Head/Head";

function TeacherManualTransactionPage() {
    return (
        <>
            <Header title="تغییر اعتبار استاد | تیکا"></Header>
            <AdminDashboard>
                <TeacherManualTransaction />
            </AdminDashboard>
        </>
    );
}

export default TeacherManualTransactionPage;

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

    return { props: {} };
}
