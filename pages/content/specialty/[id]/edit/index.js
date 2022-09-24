import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditSpecialty from "../../../../../components/AdminDashboard/Main/Content/EditSpecialty/EditSpecialty";
import Header from "../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function EditSpecialtyPage({ token, specialty, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="ویرایش تخصص | تیکا"></Header>
            <AdminDashboard>
                <EditSpecialty token={token} specialty={specialty} />
            </AdminDashboard>
        </>
    );
}

export default EditSpecialtyPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const id = context.params.id;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            specialty: dataArr[0].data,
            token,
        },
    };
}
