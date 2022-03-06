import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import TeachersScore from "../../../../components/AdminDashboard/Main/Content/TeacherSide/TeachersScore/TeachersScore";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function TeachersScorePage({ teachers, token }) {
    return (
        <>
            <Header title="امتیاز منفی اساتید | تیکا"></Header>
            <AdminDashboard>
                <TeachersScore fetchedTeachers={teachers} token={token} />
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

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/teacher/point`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            teachers: dataArr[0].data,
            token,
        },
    };
}
