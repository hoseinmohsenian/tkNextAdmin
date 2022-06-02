import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateGroupClass from "../../../../components/AdminDashboard/Main/Content/GroupClass/Create/Create";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function CreateGroupClassPage({ token, levels }) {
    return (
        <>
            <Header title="ایجاد کلاس گروهی | تیکا"></Header>
            <AdminDashboard>
                <CreateGroupClass token={token} levels={levels} />
            </AdminDashboard>
        </>
    );
}

export default CreateGroupClassPage;

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
        fetch(`${BASE_URL}/data/level`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { token, levels: dataArr[0].data },
    };
}
