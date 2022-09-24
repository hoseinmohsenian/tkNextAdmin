import AdminDashboard from "../../../../../../components/AdminDashboard/Dashboard";
import EditCompanyLanding from "../../../../../../components/AdminDashboard/Main/Content/Marketing/Landing/Company/Edit/EditCompanyLanding";
import Header from "../../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../../components/Errors/NotAuthorized/NotAllowed";

function EditCompanyLandingPage({ organization, notAllowed, token }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="ویرایش لندینگ شرکتی | تیکا"></Header>
            <AdminDashboard>
                <EditCompanyLanding token={token} landing={organization} />
            </AdminDashboard>
        </>
    );
}

export default EditCompanyLandingPage;

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
        fetch(`${BASE_URL}/admin/organization/${id}`, {
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
            organization: dataArr[0].data,
            token,
        },
    };
}
