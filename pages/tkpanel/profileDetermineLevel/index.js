import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import StudentPlacements from "../../../components/AdminDashboard/Main/Content/StudentPlacements/StudentPlacements";
import Header from "../../../components/Head/Head";

function PlacementsPage({ token, levels }) {
    return (
        <div>
            <Header title="تعیین سطح زبان آموزان | تیکا"></Header>
            <AdminDashboard>
                <StudentPlacements token={token} levels={levels} />
            </AdminDashboard>
        </div>
    );
}

export default PlacementsPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/data/level`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            levels: dataArr[0].data,
            token,
        },
    };
}
