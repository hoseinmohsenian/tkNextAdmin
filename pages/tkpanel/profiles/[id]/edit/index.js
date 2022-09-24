import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditProfile from "../../../../../components/AdminDashboard/Main/Content/Profiles/EditProfile/EditProfile";
import Header from "../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function EditUserPage({ student, token, countries, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="ویرایش زبان آموز | تیکا"></Header>
            <AdminDashboard>
                <EditProfile
                    token={token}
                    student={student}
                    countries={countries}
                />
            </AdminDashboard>
        </div>
    );
}

export default EditUserPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
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
        fetch(`${BASE_URL}/admin/student/return/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
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
    ]);

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            student: dataArr[0]?.data,
            token,
            countries: dataArr[1]?.data,
        },
    };
}
