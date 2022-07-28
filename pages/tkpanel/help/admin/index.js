import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import Help from "../../../../components/AdminDashboard/Main/Content/Help/Help";
import Header from "../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function HelpPage({ token, fetchedList, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="راهنما | تیکا"></Header>
            <AdminDashboard>
                <Help token={token} fetchedList={fetchedList} />
            </AdminDashboard>
        </div>
    );
}

export default HelpPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
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
        fetch(`${BASE_URL}/admin/help/all`, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
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
            token,
            fetchedList: dataArr[0].data,
        },
    };
}
