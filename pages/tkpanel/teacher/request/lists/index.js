import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import RequestDetails from "../../../../../components/AdminDashboard/Main/Content/PrivateClass/RequestDetails/RequestDetails";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function RequestDetailsPage({ token, classes }) {
    return (
        <div>
            <Header title="وضعیت درخواست کلاس | تیکا"></Header>
            <AdminDashboard>
                <RequestDetails token={token} fetchedClasses={classes} />
            </AdminDashboard>
        </div>
    );
}

export default RequestDetailsPage;

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
        fetch(`${BASE_URL}/admin/classroom/first-request`, {
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
            token,
            classes: dataArr[0].data,
        },
    };
}
