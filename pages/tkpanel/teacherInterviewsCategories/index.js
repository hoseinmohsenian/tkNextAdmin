import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import TeacherInterview from "../../../components/AdminDashboard/Main/Content/TeacherInterview/TeacherInterview";
import Header from "../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function TeachersInterviewPage({ teachers, token, notAllowed, searchData }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="مصاحبه با اساتید | تیکا"></Header>
            <AdminDashboard>
                <TeacherInterview
                    token={token}
                    teachers={teachers}
                    searchData={searchData}
                />
            </AdminDashboard>
        </div>
    );
}

export default TeachersInterviewPage;

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
    const { teacher_name, teacher_mobile } = context?.query;
    let searchData = {
        teacher_name: "",
        teacher_mobile: "",
    };
    let searchParams = "";

    if (isKeyValid(teacher_name)) {
        searchParams += `teacher_name=${teacher_name}&`;
        searchData = { ...searchData, teacher_name: teacher_name };
    }
    if (isKeyValid(teacher_mobile)) {
        searchParams += `teacher_mobile=${teacher_mobile}&`;
        searchData = { ...searchData, teacher_mobile: teacher_mobile };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/teacher/interview?${searchParams}`, {
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
