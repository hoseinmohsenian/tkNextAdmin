import AdminDashboard from "../../../../../../components/AdminDashboard/Dashboard";
import FAQ from "../../../../../../components/AdminDashboard/Main/Content/Marketing/Landing/Company/FAQ/FAQ";
import Header from "../../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../../components/Errors/NotAuthorized/NotAllowed";

function FAQPage({ list, notAllowed, organization_id, faq_title }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="لیست FAQ لندینگ شرکتی | تیکا"></Header>
            <AdminDashboard>
                <FAQ
                    organization_id={organization_id}
                    FAQList={list}
                    faq_title={faq_title}
                />
            </AdminDashboard>
        </>
    );
}

export default FAQPage;

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
        fetch(
            `${BASE_URL}/admin/organization/marketing/faq?organization_id=${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        ),
    ]);

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            list: dataArr[0].data,
            organization_id: id,
            faq_title: dataArr[0].meta,
        },
    };
}
