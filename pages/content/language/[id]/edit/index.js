import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditLanguage from "../../../../../components/AdminDashboard/Main/Content/EditLanguage/EditLanguage";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function EditLanguagePage({ language, token }) {
    return (
        <>
            <Header title="ویرایش زبان | تیکا"></Header>
            <AdminDashboard>
                <EditLanguage language={language} token={token} />
            </AdminDashboard>
        </>
    );
}

export default EditLanguagePage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
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

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            language: dataArr[0].data,
            token,
        },
    };
}
