import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import ChangePrice from "../../../../../components/AdminDashboard/Main/Content/TeacherSide/ChangePrice/ChangePrice";
import Header from "../../../../../components/Head/Head";

function MultiSessionPage({ token, languages }) {
    return (
        <div>
            <Header title="لیست قیمت زبان های استاد | تیکا"></Header>
            <AdminDashboard>
                <ChangePrice token={token} languages={languages} />
            </AdminDashboard>
        </div>
    );
}

export default MultiSessionPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
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
        fetch(`${BASE_URL}/data/teacher/language?teacher_id=${id}`, {
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
            token,
            languages: dataArr[0].data,
        },
    };
}
