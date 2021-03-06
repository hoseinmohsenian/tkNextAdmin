import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import LangDesc from "../../../../components/AdminDashboard/Main/Content/Languages/LangDesc/LangDesc";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function LanguagesDescPage({ languages }) {
    return (
        <>
            <Header title="توضیحات زبان ها | تیکا"></Header>
            <AdminDashboard>
                <LangDesc languages={languages} />
            </AdminDashboard>
        </>
    );
}

export default LanguagesDescPage;

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
