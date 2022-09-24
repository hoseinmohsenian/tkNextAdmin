import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import UsersLanding from "../../../../../components/AdminDashboard/Main/Content/Marketing/Landing/UsersLanding";
import Header from "../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function UsersLandingsPage({ landings, token, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="لندینگ تعاملی کاربران | تیکا"></Header>
            <AdminDashboard>
                <UsersLanding fetchedLandings={landings} token={token} />
            </AdminDashboard>
        </div>
    );
}

export default UsersLandingsPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    const { page } = context?.query;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    let searchParams = "";

    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            searchParams += `page=${page}`;
        }
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/support/landing/all/user?${searchParams}`, {
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
            token,
        },
    };
}
