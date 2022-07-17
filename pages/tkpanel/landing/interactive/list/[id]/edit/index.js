import AdminDashboard from "../../../../../../../components/AdminDashboard/Dashboard";
import EditLanding from "../../../../../../../components/AdminDashboard/Main/Content/Support/Landing/EditLanding/EditLanding";
import Header from "../../../../../../../components/Head/Head";

function CreateLandingPage({ token, landing }) {
    return (
        <div>
            <Header title="ویرایش لندینگ | تیکا"></Header>
            <AdminDashboard>
                <EditLanding token={token} landing={landing} />
            </AdminDashboard>
        </div>
    );
}

export default CreateLandingPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const id = context.params?.id;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            landing: dataArr[0].data,
            token,
        },
    };
}
