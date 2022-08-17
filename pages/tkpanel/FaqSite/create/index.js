import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateQuestion from "../../../../components/AdminDashboard/Main/Content/FAQ/FAQ/CreateQuestion/CreateQuestion";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function FAQCreateEditPage({ categories, token, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="ایجاد سوال جدید | تیکا"></Header>
            <AdminDashboard>
                <CreateQuestion categories={categories} token={token} />
            </AdminDashboard>
        </>
    );
}

export default FAQCreateEditPage;

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
        fetch(`${BASE_URL}/admin/faq/category`, {
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
            categories: dataArr[0].data,
            token,
        },
    };
}
