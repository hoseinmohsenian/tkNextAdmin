import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import AddNewClass from "../../../../components/AdminDashboard/Main/Content/PrivateClass/AddNewClass/AddNewClass";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function MultiSessionPage({ token, languages, platforms, courses, freeTime }) {
    return (
        <div>
            <Header title="ایجاد کلاس جدید | تیکا"></Header>
            <AdminDashboard>
                <AddNewClass
                    token={token}
                    languages={languages}
                    platforms={platforms}
                    courses={courses}
                    freeTime={freeTime}
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

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    let start = `${tomorrow.getFullYear()}-${
        tomorrow.getMonth() + 1
    }-${tomorrow.getDate()}`;

    const responses = await Promise.all([
        fetch(`${BASE_URL}/data/language`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
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
        fetch(
            `${BASE_URL}/data/teacher/time/free?teacher_id=6&start=${start}`,
            {
                headers: {
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        ),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            token,
            languages: dataArr[0].data,
            platforms: dataArr[1].data,
            courses: dataArr[2].data,
            freeTime: dataArr[3].data,
        },
    };
}
