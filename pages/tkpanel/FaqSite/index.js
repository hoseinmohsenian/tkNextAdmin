import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import FAQ from "../../../components/AdminDashboard/Main/Content/FAQ/FAQ/FAQ";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function FAQListPage({ faqs }) {
    return (
        <>
            <Header title="سوالات FAQ | تیکا"></Header>
            <AdminDashboard>
                <FAQ faqs={faqs} />
            </AdminDashboard>
        </>
    );
}

export default FAQListPage;

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
        fetch(`${BASE_URL}/admin/faq/question`, {
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
            faqs: dataArr[0].data,
        },
    };
}
