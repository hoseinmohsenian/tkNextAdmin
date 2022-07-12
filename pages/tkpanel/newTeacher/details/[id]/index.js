import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import Profile from "../../../../../components/AdminDashboard/Main/Content/TeacherSide/Profile/Profile";
import Header from "../../../../../components/Head/Head";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function MultiSessionPage({ token, languages }) {
    return (
        <div>
            <Header title="مشخصات استاد | تیکا"></Header>
            <AdminDashboard>
                <Profile token={token} languages={languages} />
            </AdminDashboard>
        </div>
    );
}

export default MultiSessionPage;

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
        // fetch(`${BASE_URL}/data/teacher/language?teacher_id=${id}`, {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //         "Content-type": "application/json",
        //         "Access-Control-Allow-Origin": "*",
        //     },
        // }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            token,
            // languages: dataArr[0].data,
        },
    };
}
