import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import SitePagesContent from "../../../../../components/AdminDashboard/Main/Content/SitePages/SitePagesContent/SitePagesContent";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function PagesListPage({ list, token, parent, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title={`محتوای صفحه ${parent.name} | تیکا`}></Header>
            <AdminDashboard>
                <SitePagesContent list={list} token={token} parent={parent} />
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
        fetch(`${BASE_URL}/admin/site-page/${id}`, {
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
            list: dataArr[0].data,
            parent: dataArr[1].data,
            token,
        },
    };
}
