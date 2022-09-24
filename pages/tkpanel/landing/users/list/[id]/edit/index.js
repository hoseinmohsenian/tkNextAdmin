import AdminDashboard from "../../../../../../../components/AdminDashboard/Dashboard";
import EditLanding from "../../../../../../../components/AdminDashboard/Main/Content/Marketing/Landing/EditLanding/EditLanding";
import Header from "../../../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../../../components/Errors/NotAuthorized/NotAllowed";

function EditLandingPage({ token, landing, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="ویرایش لندینگ | تیکا"></Header>
            <AdminDashboard>
                <EditLanding token={token} landing={landing} />
            </AdminDashboard>
        </div>
    );
}

export default EditLandingPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
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
        fetch(`${BASE_URL}/admin/support/landing/${id}`, {
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
            landing: dataArr[0].data,
            token,
        },
    };
}
