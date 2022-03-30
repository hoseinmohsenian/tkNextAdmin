import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import AddSessions from "../../../../../components/AdminDashboard/Main/Content/SemiPrivate/Sessions/AddSession/AddSession";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function GroupClassPage({ token, id, theClass }) {
    return (
        <>
            <Header title="جلسات کلاس نیمه خصوصی | تیکا"></Header>
            <AdminDashboard>
                <AddSessions token={token} id={id} theClass={theClass} />
            </AdminDashboard>
        </>
    );
}

export default GroupClassPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const id = context.params.id;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/semi-private/${id}`, {
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
            token,
            id,
            theClass: dataArr[0].data,
        },
    };
}
