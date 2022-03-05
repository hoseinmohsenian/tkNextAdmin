import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import TeachersFreeHours from "../../../../../components/AdminDashboard/Main/Content/TeacherSide/TeachersFreeHours/TeachersFreeHours";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function TeachersFreeHoursPage({ token, languages }) {
    return (
        <div>
            <Header title="ساعت خالی استاد | تیکا"></Header>
            <AdminDashboard>
                <TeachersFreeHours token={token} languages={languages} />
            </AdminDashboard>
        </div>
    );
}

export default TeachersFreeHoursPage;

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
        fetch(`${BASE_URL}/data/language`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return { props: { token, languages: dataArr[0].data } };
}
