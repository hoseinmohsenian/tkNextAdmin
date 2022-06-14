import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import Reporting from "../../../../../components/AdminDashboard/Main/Content/Reporting/Reporting";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function ReportingPage({ token, languages }) {
    return (
        <div>
            <Header title="گزارش گیری | تیکا"></Header>
            <AdminDashboard>
                <Reporting token={token} languages={languages} />
            </AdminDashboard>
        </div>
    );
}

export default ReportingPage;

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
            token,
            languages: dataArr[0].data,
        },
    };
}
