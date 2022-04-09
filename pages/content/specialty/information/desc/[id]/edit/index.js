import AdminDashboard from "../../../../../../../components/AdminDashboard/Dashboard";
import EditSpecialitiesDesc from "../../../../../../../components/AdminDashboard/Main/Content/Specialities/SpecialitiesDesc/EditSpecialitiesDesc/EditSpecialitiesDesc";
import Header from "../../../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../../../constants";

function EditSpecialtyDescPage({ token, specialty }) {
    return (
        <>
            <Header title="ویرایش توضیحات تخصص | تیکا"></Header>
            <AdminDashboard>
                <EditSpecialitiesDesc token={token} specialty={specialty} />
            </AdminDashboard>
        </>
    );
}

export default EditSpecialtyDescPage;

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
        fetch(`${BASE_URL}/admin/teaching/speciality/${id}`, {
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
            specialty: dataArr[0].data,
            token,
        },
    };
}
