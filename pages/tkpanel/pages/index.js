import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import SitePages from "../../../components/AdminDashboard/Main/Content/SitePages/SitePages";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function SitePagesPage({ pages }) {
    return (
        <>
            <Header title="صفحات سایت | تیکا"></Header>
            <AdminDashboard>
                <SitePages pages={pages} />
            </AdminDashboard>
        </>
    );
}

export default SitePagesPage;

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
        fetch(`${BASE_URL}/admin/site-page`, {
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
            pages: dataArr[0].data,
        },
    };
}
