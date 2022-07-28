import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import AddPlacement from "../../../../../components/AdminDashboard/Main/Content/StudentPlacements/AddPlacement/AddPlacement";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants/index";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function AddPlacementPage({ token, levels, languages, user, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="اضافه کردن تعیین سطح زبان آموز | تیکا"></Header>
            <AdminDashboard>
                <AddPlacement
                    token={token}
                    levels={levels}
                    languages={languages}
                    user={user}
                />
            </AdminDashboard>
        </div>
    );
}

export default AddPlacementPage;

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
        fetch(`${BASE_URL}/data/level`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/data/language`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/admin/student/return/${id}`, {
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
            levels: dataArr[0].data,
            languages: dataArr[1].data,
            user: dataArr[2].data,
            token,
        },
    };
}
