import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import BlackList from "../../../components/AdminDashboard/Main/Content/BlackList/BlackList";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function BlackListPage({ list, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="لیست سیاه | تیکا"></Header>
            <AdminDashboard>
                <BlackList fetchedList={list} />
            </AdminDashboard>
        </>
    );
}

export default BlackListPage;

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
        fetch(`${BASE_URL}/admin/management/block-user`, {
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
            list: dataArr[0].data,
        },
    };
}
