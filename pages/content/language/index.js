import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Languages from "../../../components/AdminDashboard/Main/Content/Languages/Languages";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function LanguagesPage({ languages }) {
    return (
        <>
            <Header title="زبان ها | تیکا"></Header>
            <AdminDashboard>
                <Languages languages={languages} />
            </AdminDashboard>
        </>
    );
}

export default LanguagesPage;

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
        fetch(`${BASE_URL}/admin/language`, {
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
            languages: dataArr[0].data,
        },
    };
}
