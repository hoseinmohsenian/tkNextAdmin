import AdminDashboard from "../../../../../../../components/AdminDashboard/Dashboard";
import EditPagesList from "../../../../../../../components/AdminDashboard/Main/Content/SitePages/SitePagesContent/Edit/EditContent";
import Header from "../../../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../../../constants";

function EditSitePageContentPage({ content, token, page_id, content_id }) {
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
