import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import TodayClass from "../../../../../components/AdminDashboard/Main/Content/PrivateClass/TodayClass/TodayClass";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function TodayClassPage({ classes, token, meta, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="کلاس های امروز | تیکا"></Header>
            <AdminDashboard>
                <TodayClass
                    fetchedClasses={classes}
                    token={token}
                    fetchedMeta={meta}
                />
            </AdminDashboard>
        </div>
    );
}

export default TodayClassPage;

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
        fetch(`${BASE_URL}/admin/classroom/today`, {
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
            meta: dataArr[0].meta,
            token,
        },
    };
}
