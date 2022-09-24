import AdminDashboard from "../../../../../../../components/AdminDashboard/Dashboard";
import EditPagesList from "../../../../../../../components/AdminDashboard/Main/Content/SitePages/SitePagesContent/Edit/EditContent";
import Header from "../../../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../../../components/Errors/NotAuthorized/NotAllowed";

function EditSitePageContentPage({
    content,
    token,
    page_id,
    content_id,
    notAllowed,
}) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="ویرایش محتوای صفحه | تیکا"></Header>
            <AdminDashboard>
                <EditPagesList
                    content={content}
                    token={token}
                    page_id={page_id}
                    content_id={content_id}
                />
            </AdminDashboard>
        </>
    );
}

export default EditSitePageContentPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const { content_id, page_id } = context.params;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/site-page/list/${content_id}`, {
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
            content: dataArr[0].data,
            token,
            page_id,
            content_id,
        },
    };
}
