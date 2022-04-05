import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import RequestDetailsList from "../../../../../components/AdminDashboard/Main/Content/PrivateClass/RequestDetailsList/RequestDetailsList";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function RequestDetailsListPage({ classes, token }) {
    return (
        <div>
            <Header title="وضعیت کلی کلاس ها | تیکا"></Header>
            <AdminDashboard>
                <RequestDetailsList fetchedClasses={classes} token={token} />
            </AdminDashboard>
        </div>
    );
}

export default RequestDetailsListPage;

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
    //     fetch(`${BASE_URL}/admin/classroom`, {
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
            // classes: dataArr[0].data,
            classes: { data: [], current_page: 1, first_page_url: "" },
            token,
        },
    };
}
