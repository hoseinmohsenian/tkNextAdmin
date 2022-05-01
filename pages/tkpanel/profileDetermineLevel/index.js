import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import StudentPlacements from "../../../components/AdminDashboard/Main/Content/StudentPlacements/StudentPlacements";
import Header from "../../../components/Head/Head";

function PlacementsPage({ token }) {
    return (
        <div>
            <Header title="تعیین سطح زبان آموزان | تیکا"></Header>
            <AdminDashboard>
                <StudentPlacements token={token} />
            </AdminDashboard>
        </div>
    );
}

export default PlacementsPage;

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
