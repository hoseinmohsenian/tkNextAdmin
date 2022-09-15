import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import StudentsCredit from "../../../../components/AdminDashboard/Main/Content/CreditClass/StudentsCredit/StudentsCredit";
import Header from "../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function StudentsCreditsPage({ students, teachers, notAllowed, searchData }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="لیست زبان آموزان اعتباری | تیکا"></Header>
            <AdminDashboard>
                <StudentsCredit
                    fetchedStudents={students}
                    teachers={teachers}
                    searchData={searchData}
                />
            </AdminDashboard>
        </>
    );
}

export default StudentsCreditsPage;

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
    const { page, teacher_name, user_name } = context?.query;
    let searchData = {
        teacher_name: "",
        user_name: "",
    };
    let searchParams = "";
    if (isKeyValid(teacher_name)) {
        searchParams += `teacher_name=${teacher_name}&`;
        searchData = { ...searchData, teacher_name: teacher_name };
    }
    if (isKeyValid(user_name)) {
        searchParams += `user_name=${user_name}&`;
        searchData = { ...searchData, user_name: user_name };
    }
    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            searchParams += `page=${page}`;
            searchParams = { ...searchParams, page: page };
        }
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/credit/enable?${searchParams}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/admin/credit/teacher`, {
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
            students: dataArr[0].data,
            teachers: dataArr[1].data?.data || [],
            searchData,
        },
    };
}
