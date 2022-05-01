import AdminDashboard from "../../../../../../components/AdminDashboard/Dashboard";
import EditStatus from "../../../../../../components/AdminDashboard/Main/Content/SystemLogs/StatusList/EditStatus/EditStatus";
import Header from "../../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../../constants";

function EditSystemLogStatusPage({ token, status }) {
    return (
        <>
            <Header title="ویرایش وضیعت پیگیری | تیکا"></Header>
            <AdminDashboard>
                <EditStatus token={token} status={status} />
            </AdminDashboard>
        </>
    );
}

export default EditSystemLogStatusPage;

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
        fetch(`${BASE_URL}/admin/tracking-log/status/${id}`, {
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
            status: dataArr[0].data,
            token,
        },
    };
}
