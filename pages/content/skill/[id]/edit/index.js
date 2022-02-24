import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditSkill from "../../../../../components/AdminDashboard/Main/Content/EditSkill/EditSkill";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function EditSkillPage({ token, skill }) {
    return (
        <>
            <Header
                title="ویرایش مهارت | تیکا"
                description="آموزش زبان انگلیسی با متد تیکا٬ تیکا بهترین نرم افزار آموزش زبان برای استفاده سنین و  کلیه سطوح ، یادگیری تعاملی زبان و دریافت مدرک معتبر بهمراه محتوای بروز"
                keywords="تیکا, اپلیکیشن زبان انگلیسی, اپلیکیشن آموزش زبان, آموزش رایگان زبان انگلیسی, مکالمه روان انگلیسی, تقویت مکالمه زبان انگلیسی, یادگیری لغات انگلیسی"
                og_description="آموزش زبان انگلیسی با متد تیکا٬ بهترین نرم افزار آموزش زبان برای استفاده سنین و  کلیه سطوح ، یادگیری تعاملی زبان و دریافت مدرک معتبر بهمراه محتوای بروز"
                og_title="آموزش زبان انگلیسی | تیکا | tikkaa"
            ></Header>
            <AdminDashboard>
                <EditSkill token={token} skill={skill} />
            </AdminDashboard>
        </>
    );
}

export default EditSkillPage;

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

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            skill: dataArr[0].data,
            token,
        },
    };
}
