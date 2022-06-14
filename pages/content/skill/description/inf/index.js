import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import SkillsDesc from "../../../../../components/AdminDashboard/Main/Content/Skills/SkillsDesc/SkillsDesc";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function SkillsDescPage({ skills }) {
    return (
        <>
            <Header title="توضیحات مهارت ها | تیکا"></Header>
            <AdminDashboard>
                <SkillsDesc fetchedSkills={skills} />
            </AdminDashboard>
        </>
    );
}

export default SkillsDescPage;

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
        props: { skills: dataArr[0].data },
    };
}
