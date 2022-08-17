import AdminDashboard from "../../../../../../../components/AdminDashboard/Dashboard";
import EditSkillsDesc from "../../../../../../../components/AdminDashboard/Main/Content/Skills/SkillsDesc/EditSkillsDesc/EditSkillsDesc";
import Header from "../../../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../../../constants";
import { checkResponseArrAuth } from "../../../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../../../components/Errors/NotAuthorized/NotAllowed";

function EditSkillDescPage({ token, skill, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="ویرایش توضیحات مهارت | تیکا"></Header>
            <AdminDashboard>
                <EditSkillsDesc token={token} skill={skill} />
            </AdminDashboard>
        </>
    );
}

export default EditSkillDescPage;

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
        fetch(`${BASE_URL}/admin/teaching/skill/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            skill: dataArr[0].data,
            token,
        },
    };
}
