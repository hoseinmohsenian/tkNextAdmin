import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import Landing from "../../../../../components/AdminDashboard/Main/Content/Support/Landing/Landing";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function LandingsPage({ landings, token }) {
    return (
        <div>
            <Header title="لندینگ تعاملی | تیکا"></Header>
            <AdminDashboard>
                <Landing fetchedLandings={landings} token={token} />
            </AdminDashboard>
        </div>
    );
}

export default LandingsPage;

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
        fetch(`${BASE_URL}/admin/support/landing/all/user`, {
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
