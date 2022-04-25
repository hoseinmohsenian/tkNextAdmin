import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Discount from "../../../components/AdminDashboard/Main/Content/Discount/Discount";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function DiscountPage({ discounts }) {
    return (
        <>
            <Header title="لیست کوپن تخفیف | تیکا"></Header>
            <AdminDashboard>
                <Discount discounts={discounts} />
            </AdminDashboard>
        </>
    );
}

export default DiscountPage;

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
        fetch(`${BASE_URL}/admin/discount`, {
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
            discounts: dataArr[0].data,
        },
    };
}
