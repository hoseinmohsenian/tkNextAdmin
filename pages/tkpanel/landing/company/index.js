import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CompanyLanding from "../../../../components/AdminDashboard/Main/Content/Marketing/Landing/Company/CompanyLanding";
import Header from "../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function CompanyLandingPage({ organizations, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="لیست لندینگ های شرکتی | تیکا"></Header>
            <AdminDashboard>
                <CompanyLanding landings={organizations} />
            </AdminDashboard>
        </>
    );
}

export default CompanyLandingPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
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
        fetch(`${BASE_URL}/admin/organization`, {
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
            organizations: dataArr[0].data,
        },
    };
}
