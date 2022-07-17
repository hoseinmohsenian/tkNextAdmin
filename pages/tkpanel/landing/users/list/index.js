import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import UsersLanding from "../../../../../components/AdminDashboard/Main/Content/Support/Landing/UsersLanding";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function UsersLandingsPage({ landings, token }) {
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
    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            landings: dataArr[0].data,
            token,
        },
    };
}
