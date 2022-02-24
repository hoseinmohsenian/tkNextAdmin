import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Platforms from "../../../components/AdminDashboard/Main/Content/Platforms/Platforms";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function MultiplatformPage({ platforms }) {
    return (
        <div>
            <Header title="پلتفرم | تیکا"></Header>
            <AdminDashboard>
                <Platforms fetchedPlatforms={platforms} />
            </AdminDashboard>
        </div>
    );
}

export default MultiplatformPage;

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
        fetch(`${BASE_URL}/admin/platform`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { platforms: dataArr[0].data },
    };
}
