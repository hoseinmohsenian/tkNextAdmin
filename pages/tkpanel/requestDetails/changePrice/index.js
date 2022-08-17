import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import ChangePrice from "../../../../components/AdminDashboard/Main/Content/ChangePrice/ChangePrice";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function ChangePricePage({ pirces, token, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="لیست تغییر قیمت کلاس | تیکا"></Header>
            <AdminDashboard>
                <ChangePrice fetchedPrices={pirces} token={token} />
            </AdminDashboard>
        </div>
    );
}

export default ChangePricePage;

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
        fetch(`${BASE_URL}/admin/classroom/change-price`, {
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
            pirces: dataArr[0].data,
            token,
        },
    };
}
