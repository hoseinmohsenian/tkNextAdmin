import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditPlacement from "../../../../../components/AdminDashboard/Main/Content/StudentPlacements/EditPlacement/EditPlacement";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function EditPlacementPage({ levels, token, placement }) {
    return (
        <>
            <Header title="ویرایش تعیین سطح زبان آموز | تیکا"></Header>
            <AdminDashboard>
                <EditPlacement
                    levels={levels}
                    token={token}
                    placement={placement}
                />
            </AdminDashboard>
        </>
    );
}

export default EditPlacementPage;

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
        fetch(`${BASE_URL}/data/level`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/admin/student/placement/${id}`, {
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
            levels: dataArr[0].data,
            placement: dataArr[1].data,
            token,
        },
    };
}
