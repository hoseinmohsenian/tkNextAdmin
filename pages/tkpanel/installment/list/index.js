import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import ClassList from "../../../../components/AdminDashboard/Main/Content/CreditClass/ClassList/ClassList";
import Header from "../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function ClassListPage({ list, notAllowed, searchData }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="لیست کلاس های اعتباری | تیکا"></Header>
            <AdminDashboard>
                <ClassList fetchedList={list} searchData={searchData} />
            </AdminDashboard>
        </>
    );
}

export default ClassListPage;

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

    const isKeyValid = (key) => key && key !== undefined;
    const { page, teacher_name, teacher_mobile, user_name, user_mobile } =
        context?.query;
    let searchData = {
        teacher_name: "",
        teacher_mobile: "",
        user_name: "",
        user_mobile: "",
    };
    let searchQuery = "";

    if (isKeyValid(teacher_name)) {
        searchQuery += `teacher_name=${teacher_name}&`;
        searchData = { ...searchData, teacher_name: teacher_name };
    }
    if (isKeyValid(teacher_mobile)) {
        searchQuery += `teacher_mobile=${teacher_mobile}&`;
        searchData = { ...searchData, teacher_mobile: teacher_mobile };
    }
    if (isKeyValid(user_name)) {
        searchQuery += `user_name=${user_name}&`;
        searchData = { ...searchData, user_name: user_name };
    }
    if (isKeyValid(user_mobile)) {
        searchQuery += `user_mobile=${user_mobile}&`;
        searchData = { ...searchData, user_mobile: user_mobile };
    }
    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            searchQuery += `page=${page}`;
            searchQuery = { ...searchQuery, page: page };
        }
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/credit/reserve?${searchQuery}`, {
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
            list: dataArr[0].data,
            searchData,
        },
    };
}
