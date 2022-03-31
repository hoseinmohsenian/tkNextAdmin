import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import ChangePrice from "../../../../components/AdminDashboard/Main/Content/ChangePrice/ChangePrice";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function ChangePricePage({ pirces, token }) {
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

    // const responses = await Promise.all([
    //     fetch(`${BASE_URL}/admin/classroom/change-price`, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             "Content-type": "application/json",
    //             "Access-Control-Allow-Origin": "*",
    //         },
    //     }),
    // ]);

    // const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            // pirces: dataArr[0].data,
            pirces: { data: [], current_page: 1, first_page_url: "" },
            token,
        },
    };
}
