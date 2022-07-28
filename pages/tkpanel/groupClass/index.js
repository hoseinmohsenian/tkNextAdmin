import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import GroupClass from "../../../components/AdminDashboard/Main/Content/GroupClass/GroupClass";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function GroupClassPage({ classes, token, searchData, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="لیست کلاس های گروهی | تیکا"></Header>
            <AdminDashboard>
                <GroupClass
                    fetchedClasses={classes}
                    token={token}
                    searchData={searchData}
                />
            </AdminDashboard>
        </>
    );
}

export default GroupClassPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const isKeyValid = (key) => key !== undefined;
    const { teacher_name, title, status, page } = context?.query;
    let searchData = {
        teacher_name: "",
        title: "",
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
    if (isKeyValid(title)) {
        searchParams += `title=${title}&`;
        searchData = { ...searchData, title: title };
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
        fetch(`${BASE_URL}/admin/group-class?${searchParams}`, {
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
            token,
            searchData,
        },
    };
}
