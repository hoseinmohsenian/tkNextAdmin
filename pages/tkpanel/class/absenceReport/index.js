import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import NotPaidClasses from "../../../../components/AdminDashboard/Main/Content/NotPaidClasses/NotPaidClasses";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function NotPaidClassesPage({ classes, token, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="لیست گزارش غیبت | تیکا"></Header>
            <AdminDashboard>
                <h1>گزارش های غیبت | در حال ساخت :)</h1>
                {/* <NotPaidClasses
                    //  fetchedClasses={classes}
                    token={token}
                /> */}
            </AdminDashboard>
        </>
    );
}

export default NotPaidClassesPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    // const { page } = context?.query;
    // const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    // let searchParams = "";

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    // if (isKeyValid(page)) {
    //     if (Number(page) > 0) {
    //         searchParams += `page=${page}`;
    //     }
    // }

    // const responses = await Promise.all([
    //     fetch(`${BASE_URL}/admin/classroom/not-payed?${searchParams}`, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             "Content-type": "application/json",
    //             "Access-Control-Allow-Origin": "*",
    //         },
    //     }),
    // ]);

    // const dataArr = await Promise.all(responses.map((res) => res.json()));

    // if (!checkResponseArrAuth(responses)) {
    //     return {
    //         props: { notAllowed: true },
    //     };
    // }

    return {
        props: {
            // classes: dataArr[0].data,
            token,
        },
    };
}
