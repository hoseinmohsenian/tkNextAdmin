import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import AddNewClass from "../../../../components/AdminDashboard/Main/Content/PrivateClass/AddNewClass/AddNewClass";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function MultiSessionPage({
    token,
    languages,
    platforms,
    courses,
    schedulerData,
}) {
    return (
        <div>
            <Header title="ایجاد کلاس جدید | تیکا"></Header>
            <AdminDashboard>
                <AddNewClass
                    token={token}
                    languages={languages}
                    platforms={platforms}
                    courses={courses}
                    schedulerData={schedulerData}
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

    const date = new Date();
    let start = `${date.getFullYear()}-${
        date.getMonth() + 1
    }-${date.getDate()}`;
    const nextWeek = new Date(
        new Date(start).getTime() + 7 * 24 * 60 * 60 * 1000
    );
    let end = `${nextWeek.getFullYear()}-${
        nextWeek.getMonth() + 1
    }-${nextWeek.getDate()}`;

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
            `${BASE_URL}/admin/teacher/calendar/16?start=${start}&end=${end}`,
            {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
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
            // schedulerData: dataArr[3].data,
            schedulerData: [],
        },
    };
}
