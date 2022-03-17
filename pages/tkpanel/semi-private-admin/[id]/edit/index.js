import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditSemiPrivate from "../../../../../components/AdminDashboard/Main/Content/SemiPrivate/Edit/Edit";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function GroupClassPage({ theClass, token }) {
    return (
        <>
            <Header title="ویرایش کلاس نیمه خصوصی"></Header>
            <AdminDashboard>
                <EditSemiPrivate theClass={theClass} token={token} />
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
            theClass: dataArr[0].data,
            token,
        },
    };
}
