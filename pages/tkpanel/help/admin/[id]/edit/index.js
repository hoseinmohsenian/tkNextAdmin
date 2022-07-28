import AdminDashboard from "../../../../../../components/AdminDashboard/Dashboard";
import EditHelp from "../../../../../../components/AdminDashboard/Main/Content/Help/EditHelp/EditHelp";
import Header from "../../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../../components/Errors/NotAuthorized/NotAllowed";

function EditHelpPage({ token, data, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="ویرایش راهنما | تیکا"></Header>
            <AdminDashboard>
                <EditHelp token={token} data={data} />
            </AdminDashboard>
        </div>
    );
}

export default EditHelpPage;

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
        fetch(`${BASE_URL}/admin/help/${id}`, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
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
            token,
            data: dataArr[0].data,
        },
    };
}
