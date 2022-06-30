import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import StudentsCredit from "../../../../components/AdminDashboard/Main/Content/CreditClass/StudentsCredit/StudentsCredit";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function StudentsCreditsPage({ students, token }) {
    return (
        <>
            <Header title="لیست زبان آموزان اعتباری | تیکا"></Header>
            <AdminDashboard>
                <StudentsCredit fetchedStudents={students} token={token} />
            </AdminDashboard>
        </>
    );
}

export default StudentsCreditsPage;

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
        fetch(`${BASE_URL}/admin/credit/enable`, {
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
            students: dataArr[0].data,
            token,
        },
    };
}
