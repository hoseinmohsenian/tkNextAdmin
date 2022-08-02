import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import TeacherQuestions from "../../../../components/AdminDashboard/Main/Content/TeacherInterview/TeacherQuestions/TeacherQuestions";
import Header from "../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function TeacherInterviewPage({ list, token, notAllowed, teacher }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }

    const fullName = `${teacher.name} ${teacher.family}`;
    return (
        <div>
            <Header title={`پرسش های استاد ${fullName} | تیکا`}></Header>
            <AdminDashboard>
                <TeacherQuestions
                    token={token}
                    fetchedList={list}
                    teacher={teacher}
                />
            </AdminDashboard>
        </div>
    );
}

export default TeacherInterviewPage;

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
        fetch(`${BASE_URL}/admin/teacher/interview/list?teacher_id=${id}`, {
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
        props: { list: dataArr[0]?.data, token, teacher: dataArr[0]?.meta },
    };
}
