import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import TeachersScore from "../../../../components/AdminDashboard/Main/Content/TeacherSide/TeachersScore/TeachersScore";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function TeachersScorePage({ teachers, token, notAllowed, searchData }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="امتیاز منفی اساتید | تیکا"></Header>
            <AdminDashboard>
                <TeachersScore
                    fetchedTeachers={teachers}
                    token={token}
                    searchData={searchData}
                />
            </AdminDashboard>
        </>
    );
}

export default TeachersScorePage;

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

    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    const { teacher_name } = context?.query;
    let searchData = {
        teacher_name: "",
    };
    let searchParams = "";

    if (isKeyValid(teacher_name)) {
        searchParams += `teacher_name=${teacher_name}&`;
        searchData = { ...searchData, teacher_name: teacher_name };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/teacher/point?${searchParams}`, {
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
            teachers: dataArr[0].data,
            token,
            searchData,
        },
    };
}
