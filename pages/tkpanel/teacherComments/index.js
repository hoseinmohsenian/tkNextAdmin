import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import TeachersComments from "../../../components/AdminDashboard/Main/Content/Support/TeachersComments/TeachersComments";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function TeachersCommentsPage({ comments, token }) {
    return (
        <div>
            <Header title="کامنت های اساتید | تیکا"></Header>
            <AdminDashboard>
                <TeachersComments fetchedComments={comments} token={token} />
            </AdminDashboard>
        </div>
    );
}

export default TeachersCommentsPage;

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
        fetch(`${BASE_URL}/admin/support/teacher-comment`, {
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
            comments: dataArr[0].data,
            token,
        },
    };
}
