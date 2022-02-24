import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Teachers from "../../../components/AdminDashboard/Main/Content/TeacherSide/Teachers";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function TeacherSidePage({ teachers, token }) {
    return (
        <div>
            <Header title="اساتید | تیکا"></Header>
            <AdminDashboard>
                <Teachers fetchedTeachers={teachers} token={token} />
            </AdminDashboard>
        </div>
    );
}

export default TeacherSidePage;

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
    const { page } = context?.query;
    let params = "";
    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            params += `page=${page}`;
        }
    }
    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/teacher?${params}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { teachers: dataArr[0]?.data, token },
    };
}
