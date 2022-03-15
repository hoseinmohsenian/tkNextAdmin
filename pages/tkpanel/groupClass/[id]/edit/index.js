import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditGroupClass from "../../../../../components/AdminDashboard/Main/Content/GroupClass/Edit/Edit";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function EditGroupClassPage({ token, languages, levels, fetchedClass }) {
    return (
        <>
            <Header title="ویرایش کلاس گروهی | تیکا"></Header>
            <AdminDashboard>
                <EditGroupClass
                    token={token}
                    languages={languages}
                    levels={levels}
                    fetchedClass={fetchedClass}
                />
            </AdminDashboard>
        </>
    );
}

export default EditGroupClassPage;

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
        fetch(`${BASE_URL}/admin/group-class/${id}`, {
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
            token,
            languages: dataArr[0].data,
            levels: dataArr[1].data,
            fetchedClass: dataArr[2].data,
        },
    };
}
