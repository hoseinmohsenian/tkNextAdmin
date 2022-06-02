import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditPlatform from "../../../../../components/AdminDashboard/Main/Content/EditPlatform/EditPlatform";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function EditMultiplatformPage({ token, platform }) {
    return (
        <>
            <Header title="ویرایش پلتفرم | تیکا"></Header>
            <AdminDashboard>
                <EditPlatform token={token} platform={platform} />
            </AdminDashboard>
        </>
    );
}

export default EditMultiplatformPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const id = context.params.id;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/platform/${id}`, {
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
            platform: dataArr[0].data,
            token,
        },
    };
}
