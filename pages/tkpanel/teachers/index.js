import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Teachers from "../../../components/AdminDashboard/Main/Content/TeacherSide/Teachers";
import Header from "../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function TeacherSidePage({ teachers, token, searchData, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="اساتید | تیکا"></Header>
            <AdminDashboard>
                <Teachers
                    fetchedTeachers={teachers}
                    token={token}
                    searchData={searchData}
                />
            </AdminDashboard>
        </div>
    );
}

export default TeacherSidePage;

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

    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    const { name, mobile, email, page } = context?.query;
    let searchData = {
        name: "",
        mobile: "",
        email: "",
    };
    let searchParams = "";

    if (isKeyValid(name)) {
        searchParams += `name=${name}&`;
        searchData = { ...searchData, name: name };
    }
    if (isKeyValid(email)) {
        searchParams += `email=${email}&`;
        searchData = { ...searchData, email: email };
    }
    if (isKeyValid(mobile)) {
        searchParams += `mobile=${mobile}&`;
        searchData = { ...searchData, mobile: mobile };
    }
    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            searchParams += `page=${page}`;
            searchParams = { ...searchParams, page: page };
        }
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/teacher/search?${searchParams}`, {
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
        props: { teachers: dataArr[0]?.data, token, searchData },
    };
}
