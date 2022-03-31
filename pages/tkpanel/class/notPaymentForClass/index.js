import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import NotPaidClasses from "../../../../components/AdminDashboard/Main/Content/NotPaidClasses/NotPaidClasses";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function NotPaidClassesPage({ classes, token }) {
    return (
        <>
            <Header title="لیست کلاس های پرداخت نشده | تیکا"></Header>
            <AdminDashboard>
                <NotPaidClasses fetchedClasses={classes} token={token} />
            </AdminDashboard>
        </>
    );
}

export default NotPaidClassesPage;

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
        fetch(`${BASE_URL}/admin/classroom/not-payed`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            classes: dataArr[0].data,
            token,
        },
    };
}
