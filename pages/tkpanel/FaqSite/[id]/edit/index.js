import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditQuestion from "../../../../../components/AdminDashboard/Main/Content/FAQ/FAQ/EditQuestion/EditQuestion";
import Header from "../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function FAQCreateEditPage({ token, categories, question, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="ویرایش سوال | تیکا"></Header>
            <AdminDashboard>
                <EditQuestion
                    token={token}
                    categories={categories}
                    question={question}
                />
            </AdminDashboard>
        </>
    );
}

export default FAQCreateEditPage;

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
        fetch(`${BASE_URL}/admin/faq/category`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/admin/faq/question/${id}`, {
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
            question: dataArr[1].data,
        },
    };
}
