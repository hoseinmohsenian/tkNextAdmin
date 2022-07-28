import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import UsedCoupons from "../../../components/AdminDashboard/Main/Content/Discount/UsedCopens/UsedCoupons";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function UsedCouponsPage({ copens, token, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="لیست کدهای تخفیف استفاده شده | تیکا"></Header>
            <AdminDashboard>
                <UsedCoupons fetchedCopens={copens} token={token} />
            </AdminDashboard>
        </div>
    );
}

export default UsedCouponsPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const { page } = context?.query;
    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    let searchParams = "";

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            searchParams += `page=${page}`;
        }
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/discount/used/all?${searchParams}`, {
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
        props: { copens: dataArr[0].data, token },
    };
}
