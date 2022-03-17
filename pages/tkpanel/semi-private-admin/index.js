import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import SemiPrivate from "../../../components/AdminDashboard/Main/Content/SemiPrivate/SemiPrivate";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function GroupClassPage({ classes, token }) {
    return (
        <>
            <Header title="لیست کلاس های نیمه خصوصی | تیکا"></Header>
            <AdminDashboard>
                <SemiPrivate fetchedClasses={classes} token={token} />
            </AdminDashboard>
        </>
    );
}

export default GroupClassPage;

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
        fetch(`${BASE_URL}/admin/semi-private`, {
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
            classes: dataArr[0].data,
            token,
        },
    };
}
