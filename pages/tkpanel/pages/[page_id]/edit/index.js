import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditSitePage from "../../../../../components/AdminDashboard/Main/Content/SitePages/Edit/EditSitePage";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function EditSitePagePage({ page, token, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="ویرایش صفحه سایت | تیکا"></Header>
            <AdminDashboard>
                <EditSitePage page={page} token={token} />
            </AdminDashboard>
        </>
    );
}

export default EditSitePagePage;

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
            page: dataArr[0].data,
            token,
        },
    };
}
