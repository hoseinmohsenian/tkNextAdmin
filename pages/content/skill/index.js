import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Skills from "../../../components/AdminDashboard/Main/Content/Skills/Skills";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";

function SkillsPage({ token, skills }) {
    return (
        <>
            <Header title="مهارت ها | تیکا"></Header>
            <AdminDashboard>
                <Skills fetchedSkills={skills} token={token} />
            </AdminDashboard>
        </>
    );
}

export default SkillsPage;

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
        fetch(`${BASE_URL}/admin/teaching/skill`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { token, skills: dataArr[0].data },
    };
}
