import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditPlatform from "../../../../../components/AdminDashboard/Main/Content/EditPlatform/EditPlatform";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function EditMultiplatformPage({ token, platform }) {
    return (
        <>
            <Header
                title="ویرایش کورس | تیکا"
                description="آموزش زبان انگلیسی با متد تیکا٬ تیکا بهترین نرم افزار آموزش زبان برای استفاده سنین و  کلیه سطوح ، یادگیری تعاملی زبان و دریافت مدرک معتبر بهمراه محتوای بروز"
                keywords="تیکا, اپلیکیشن زبان انگلیسی, اپلیکیشن آموزش زبان, آموزش رایگان زبان انگلیسی, مکالمه روان انگلیسی, تقویت مکالمه زبان انگلیسی, یادگیری لغات انگلیسی"
                og_description="آموزش زبان انگلیسی با متد تیکا٬ بهترین نرم افزار آموزش زبان برای استفاده سنین و  کلیه سطوح ، یادگیری تعاملی زبان و دریافت مدرک معتبر بهمراه محتوای بروز"
                og_title="آموزش زبان انگلیسی | تیکا | tikkaa"
            ></Header>
            <AdminDashboard>
                <EditPlatform token={token} platform={platform} />
            </AdminDashboard>
        </>
    );
}

export default EditMultiplatformPage;

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
        fetch(`${BASE_URL}/admin/platform/${id}`, {
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
            platform: dataArr[0].data,
            token,
        },
    };
}
