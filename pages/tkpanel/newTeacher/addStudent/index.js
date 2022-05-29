import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import AddNewClass from "../../../../components/AdminDashboard/Main/Content/PrivateClass/AddNewClass/AddNewClass";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function MultiSessionPage({ token, platforms, courses }) {
    return (
        <div>
            <Header title="ایجاد کلاس جدید | تیکا"></Header>
            <AdminDashboard>
                <AddNewClass
                    token={token}
                    platforms={platforms}
                    courses={courses}
                />
            </AdminDashboard>
        </div>
    );
}

export default MultiSessionPage;

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
        fetch(`${BASE_URL}/admin/platform`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/data/course`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            token,
            platforms: dataArr[0].data,
            courses: dataArr[1].data,
        },
    };
}
