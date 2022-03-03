import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateProfile from "../../../../components/AdminDashboard/Main/Content/Profiles/CreateProfile/CreateProfile";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function CreateProfilePage({ token, countries }) {
    return (
        <div>
            <Header title="ایجاد زبان آموز | تیکا"></Header>
            <AdminDashboard>
                <CreateProfile token={token} countries={countries} />
            </AdminDashboard>
        </div>
    );
}

export default CreateProfilePage;

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
        fetch(`${BASE_URL}/data/country`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return { props: { token, countries: dataArr[0].data } };
}
