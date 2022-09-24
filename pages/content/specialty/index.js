import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Specialities from "../../../components/AdminDashboard/Main/Content/Specialities/Specialities";
import Header from "../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function SpecialitiesPage({ token, specialitys, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="تخصص ها | تیکا"></Header>
            <AdminDashboard>
                <Specialities fetchedSpecialitys={specialitys} token={token} />
            </AdminDashboard>
        </>
    );
}

export default SpecialitiesPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
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
        fetch(`${BASE_URL}/admin/teaching/speciality`, {
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
        props: { token, specialitys: dataArr[0].data },
    };
}
