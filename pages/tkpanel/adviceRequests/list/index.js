import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import Consultation from "../../../../components/AdminDashboard/Main/Content/Support/Consultation/Consultation";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function ConsultationsPage({ consultaions, token, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="لیست درخواست مشاوره | تیکا"></Header>
            <AdminDashboard>
                <Consultation
                    fetchedConsultaions={consultaions}
                    token={token}
                />
            </AdminDashboard>
        </div>
    );
}

export default ConsultationsPage;

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
        fetch(`${BASE_URL}/admin/support/consultation`, {
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
            consultaions: dataArr[0].data,
            token,
        },
    };
}
