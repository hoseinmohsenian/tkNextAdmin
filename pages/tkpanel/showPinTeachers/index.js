import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import ShowTeacherPins from "../../../components/AdminDashboard/Main/Content/ShowTeacherPins/ShowTeacherPins";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function ShowPinTeachersPage({ teachers, token }) {
    return (
        <>
            <Header title="اساتید پین شده‌ | تیکا"></Header>
            <AdminDashboard>
                <ShowTeacherPins teachers={teachers} token={token} />
            </AdminDashboard>
        </>
    );
}

export default ShowPinTeachersPage;

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
        fetch(`${BASE_URL}/admin/blog/pin/teacher`, {
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
