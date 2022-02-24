import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import PinTeacher from "../../../components/AdminDashboard/Main/Content/PinTeacher/PinTeacher";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function PinTeacherPage({ languages, token }) {
    return (
        <>
            <Header title="پین کردن استاد | تیکا"></Header>
            <AdminDashboard>
                <PinTeacher token={token} languages={languages} />
            </AdminDashboard>
        </>
    );
}

export default PinTeacherPage;

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
        fetch(`${BASE_URL}/admin/language`, {
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
            languages: dataArr[0].data,
            token,
        },
    };
}
