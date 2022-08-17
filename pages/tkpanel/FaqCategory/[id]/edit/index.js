import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditCategory from "../../../../../components/AdminDashboard/Main/Content/FAQ/Categires/EditCategory/EditCategory";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function FAQCreateEditPage({ token, category,notAllowed}) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="ویرایش دسته بندی FAQ | تیکا"></Header>
            <AdminDashboard>
                <EditCategory token={token} category={category} />
            </AdminDashboard>
        </>
    );
}

export default FAQCreateEditPage;

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
        fetch(`${BASE_URL}/admin/faq/category/${id}`, {
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
            category: dataArr[0].data,
            token,
        },
    };
}
