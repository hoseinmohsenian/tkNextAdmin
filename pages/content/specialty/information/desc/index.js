import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import SpecialitiesDesc from "../../../../../components/AdminDashboard/Main/Content/Specialities/SpecialitiesDesc/SpecialitiesDesc";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function SpecialitiesDescPage({ specialitys, token }) {
    return (
        <>
            <Header title="توضیحات تخصص ها | تیکا"></Header>
            <AdminDashboard>
                <SpecialitiesDesc
                    fetchedSpecialitys={specialitys}
                    token={token}
                />
            </AdminDashboard>
        </>
    );
}

export default SpecialitiesDescPage;

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

    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    const { page } = context?.query;
    let params = "";
    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            params += `page=${page}`;
        }
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/teaching/speciality?${params}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { specialitys: dataArr[0].data, token },
    };
}
