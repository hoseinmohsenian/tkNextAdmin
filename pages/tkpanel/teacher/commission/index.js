import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import Commission from "../../../../components/AdminDashboard/Main/Content/TeacherSide/Commission/Commission";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function CommissionsPage({ commissions, token, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="لیست کمیسیون متغیر استاد | تیکا"></Header>
            <AdminDashboard>
                <Commission fetchedCommissions={commissions} token={token} />
            </AdminDashboard>
        </div>
    );
}

export default CommissionsPage;

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
        fetch(`${BASE_URL}/admin/teacher/changeable/commission`, {
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
            commissions: dataArr[0].data,
            token,
        },
    };
}
