import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import Profile from "../../../../../components/AdminDashboard/Main/Content/TeacherSide/Profile/Profile";
import Header from "../../../../../components/Head/Head";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function MultiSessionPage({
    languages,
    levels,
    addedLanguages,
    countries,
    tutorToken,
    adminToken,
}) {
    return (
        <div>
            <Header title="مشخصات استاد | تیکا"></Header>
            <AdminDashboard>
                <Profile
                    languages={languages}
                    levels={levels}
                    addedLanguages={addedLanguages}
                    adminToken={adminToken}
                    tutorToken={tutorToken}
                    countries={countries}
                />
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
        fetch(`${BASE_URL}/data/language`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/data/level`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/data/country`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/admin/teacher/create-token/${id}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));
    const tutorToken = dataArr[3].data;

    const res = await fetch(`${BASE_URL}/teacher/profile/return/languages`, {
        headers: {
            Authorization: `Bearer ${tutorToken}`,
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    });
    const { data: addedLanguages } = await res.json();

    return {
        props: {
            languages: dataArr[0].data,
            levels: dataArr[1].data,
            addedLanguages: addedLanguages,
            countries: dataArr[2].data,
            tutorToken: tutorToken,
            adminToken: token,
        },
    };
}
