import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import SkillsDesc from "../../../../../components/AdminDashboard/Main/Content/Skills/SkillsDesc/SkillsDesc";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function SkillsDescPage({ skills, token }) {
    return (
        <>
            <Header title="توضیحات مهارت ها | تیکا"></Header>
            <AdminDashboard>
                <SkillsDesc fetchedSkills={skills} token={token} />
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

    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    const { page } = context?.query;
    let params = "";
    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            params += `page=${page}`;
        }
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/teaching/skill?${params}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: { skills: dataArr[0].data, token },
    };
}
