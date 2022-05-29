import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Courses from "../../../components/AdminDashboard/Main/Content/Courses/Courses";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function CoursesPage({ token, courses }) {
    return (
        <>
            <Header title="کورس ها | تیکا"></Header>
            <AdminDashboard>
                <Courses fetchedCourses={courses} token={token} />
            </AdminDashboard>
        </>
    );
}

export default CoursesPage;

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
        fetch(`${BASE_URL}/admin/course`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { token, courses: dataArr[0].data },
    };
}
