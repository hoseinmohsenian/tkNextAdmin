import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import RequestDetailsList from "../../../../../components/AdminDashboard/Main/Content/PrivateClass/RequestDetailsList/RequestDetailsList";
import Header from "../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function RequestDetailsListPage({ classes, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="وضعیت کلی کلاس ها | تیکا"></Header>
            <AdminDashboard>
                <RequestDetailsList fetchedClasses={classes} />
            </AdminDashboard>
        </div>
    );
}

export default RequestDetailsListPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    const { page } = context?.query;
    let params = "";

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            params += `page=${page}`;
        }
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/classroom?${params}`, {
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
            classes: dataArr[0].data,
        },
    };
}
