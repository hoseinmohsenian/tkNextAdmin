import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Requests from "../../../components/AdminDashboard/Main/Content/Support/Requests/Requests";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function RequestsPage({ requests, token, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="لیست درخواست های ناتمام | تیکا"></Header>
            <AdminDashboard>
                <Requests fetchedRequests={requests} token={token} />
            </AdminDashboard>
        </div>
    );
}

export default RequestsPage;

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
        fetch(`${BASE_URL}/admin/support/reserve/not-finished`, {
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
        props: {
            requests: dataArr[0].data,
            token,
        },
    };
}
