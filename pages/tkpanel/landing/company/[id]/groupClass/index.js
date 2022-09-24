import AdminDashboard from "../../../../../../components/AdminDashboard/Dashboard";
import GroupClass from "../../../../../../components/AdminDashboard/Main/Content/Marketing/Landing/Company/GroupClass/GroupClass";
import Header from "../../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../../components/Errors/NotAuthorized/NotAllowed";

function GroupClassPage({
    classes,
    notAllowed,
    organization_id,
    groupClassesList,
}) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="لیست کلاس‌های گروهی لندینگ شرکتی | تیکا"></Header>
            <AdminDashboard>
                <GroupClass
                    organization_id={organization_id}
                    fetchedClasses={classes}
                    groupClassesList={groupClassesList}
                />
            </AdminDashboard>
        </>
    );
}

export default GroupClassPage;

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
            `${BASE_URL}/admin/organization/marketing/group-class?organization_id=${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        ),
        fetch(`${BASE_URL}/admin/group-class/`, {
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
            organization_id: id,
            groupClassesList: dataArr[1].data?.data || [],
        },
    };
}
