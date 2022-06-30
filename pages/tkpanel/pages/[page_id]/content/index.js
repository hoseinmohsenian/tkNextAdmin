import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import SitePagesContent from "../../../../../components/AdminDashboard/Main/Content/SitePages/SitePagesContent/SitePagesContent";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function PagesListPage({ list, token }) {
    return (
        <>
            <Header title="محتوای صفحات | تیکا"></Header>
            <AdminDashboard>
                <SitePagesContent list={list} token={token} />
            </AdminDashboard>
        </>
    );
}

export default PagesListPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const id = context.params.page_id;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/site-page/list/all/${id}`, {
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
            list: dataArr[0].data,
            token,
        },
    };
}
