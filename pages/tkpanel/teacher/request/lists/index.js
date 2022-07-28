import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import RequestDetails from "../../../../../components/AdminDashboard/Main/Content/PrivateClass/RequestDetails/RequestDetails";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function RequestDetailsPage({ token, classes, notAllowed, searchData }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="وضعیت درخواست کلاس | تیکا"></Header>
            <AdminDashboard>
                <RequestDetails
                    token={token}
                    fetchedClasses={classes}
                    searchData={searchData}
                />
            </AdminDashboard>
        </div>
    );
}

export default RequestDetailsPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const isKeyValid = (key) => key !== undefined;
    const {
        teacher_name,
        teacher_mobile,
        user_name,
        user_mobile,
        status,
        page,
    } = context?.query;
    let searchData = {
        teacher_name: "",
        teacher_mobile: "",
        user_name: "",
        user_mobile: "",
        status: -1,
    };

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    let searchParams = "";
    if (isKeyValid(teacher_name)) {
        searchParams += `teacher_name=${teacher_name}&`;
        searchData = { ...searchData, teacher_name: teacher_name };
    }
    if (isKeyValid(teacher_mobile)) {
        searchParams += `teacher_mobile=${teacher_mobile}&`;
        searchData = { ...searchData, teacher_mobile: teacher_mobile };
    }
    if (isKeyValid(user_name)) {
        searchParams += `user_name=${user_name}&`;
        searchData = { ...searchData, user_name: user_name };
    }
    if (isKeyValid(user_mobile)) {
        searchParams += `user_mobile=${user_mobile}&`;
        searchData = { ...searchData, user_mobile: user_mobile };
    }
    if (isKeyValid(status)) {
        searchParams += `status=${status}&`;
        searchData = { ...searchData, status: status };
    }
    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            searchParams += `page=${page}`;
            searchData = { ...searchData, page: page };
        }
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/classroom/first-request?${searchParams}`, {
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
            token,
            classes: dataArr[0].data,
            searchData,
        },
    };
}
