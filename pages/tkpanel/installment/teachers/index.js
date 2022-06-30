import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import TeachersCredit from "../../../../components/AdminDashboard/Main/Content/CreditClass/TeachersCredit/TeachersCredit";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function TeachersCreditsPage({ teachers, token }) {
    return (
        <>
            <Header title="لیست اساتید اعتباری | تیکا"></Header>
            <AdminDashboard>
                <TeachersCredit fetchedTeachers={teachers} token={token} />
            </AdminDashboard>
        </>
    );
}

export default TeachersCreditsPage;

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
        fetch(`${BASE_URL}/admin/credit/teacher`, {
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
