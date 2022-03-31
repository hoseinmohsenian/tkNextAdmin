import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import TodayClass from "../../../../../components/AdminDashboard/Main/Content/TodayClass/TodayClass";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function TodayClassPage({ classes, token }) {
    return (
        <div>
            <Header title="لیست تغییر قیمت کلاس | تیکا"></Header>
            <AdminDashboard>
                <TodayClass fetchedClasses={classes} token={token} />
            </AdminDashboard>
        </div>
    );
}

export default TodayClassPage;

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
    //     fetch(`${BASE_URL}/admin/classroom/today`, {
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
