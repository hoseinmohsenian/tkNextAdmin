import AdminDashboard from "../../../../../../components/AdminDashboard/Dashboard";
import EditLangDesc from "../../../../../../components/AdminDashboard/Main/Content/Languages/LangDesc/EditLangDesc/EditLangDesc";
import Header from "../../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../../components/Errors/NotAuthorized/NotAllowed";

function EditLanguageDescPage({ language, token, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="ویرایش توضیحات زبان | تیکا"></Header>
            <AdminDashboard>
                <EditLangDesc language={language} token={token} />
            </AdminDashboard>
        </>
    );
}

export default EditLanguageDescPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const id = context.params.id;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/language/${id}`, {
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
            language: dataArr[0].data,
            token,
        },
    };
}
