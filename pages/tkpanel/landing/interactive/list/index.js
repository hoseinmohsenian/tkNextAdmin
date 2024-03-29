import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import Landing from "../../../../../components/AdminDashboard/Main/Content/Marketing/Landing/Landing";
import Header from "../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function LandingsPage({ landings, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="لندینگ تعاملی | تیکا"></Header>
            <AdminDashboard>
                <Landing landings={landings} />
            </AdminDashboard>
        </div>
    );
}

export default LandingsPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/marketing/landing`, {
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
            landings: dataArr[0].data,
        },
    };
}
