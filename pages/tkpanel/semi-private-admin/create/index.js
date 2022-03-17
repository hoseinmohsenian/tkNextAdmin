import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateSemiPrivate from "../../../../components/AdminDashboard/Main/Content/SemiPrivate/Create/Create";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function GroupClassPage({ languages, token }) {
    return (
        <>
            <Header title="کلاس نیمه خصوصی جدید |‌ تیکا"></Header>
            <AdminDashboard>
                <CreateSemiPrivate languages={languages} token={token} />
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
        fetch(`${BASE_URL}/data/language`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            languages: dataArr[0].data,
            token,
        },
    };
}
