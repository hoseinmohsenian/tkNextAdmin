import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import GroupClass from "../../../components/AdminDashboard/Main/Content/GroupClass/GroupClass";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function GroupClassPage({ classes, token }) {
    return (
        <>
            <Header title="لیست کلاس های گروهی | تیکا"></Header>
            <AdminDashboard>
                <GroupClass fetchedClasses={classes} token={token} />
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
        fetch(`${BASE_URL}/admin/group-class`, {
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
