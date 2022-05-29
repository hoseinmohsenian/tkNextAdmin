import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditCourse from "../../../../../components/AdminDashboard/Main/Content/Courses/EditCourse/EditCourse";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function EditCoursePage({ token, course }) {
    return (
        <>
            <Header title="ویرایش کورس | تیکا"></Header>
            <AdminDashboard>
                <EditCourse token={token} course={course} />
            </AdminDashboard>
        </>
    );
}

export default EditCoursePage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
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
        fetch(`${BASE_URL}/admin/course/${id}`, {
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
            course: dataArr[0].data,
            token,
        },
    };
}
