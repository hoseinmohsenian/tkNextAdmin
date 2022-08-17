import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import CreateSpecialty from "../../../../components/AdminDashboard/Main/Content/CreateSpecialty/CreateSpecialty";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function CreateSpecialtyPage({ languages }) {
    return (
        <>
            <Header title="ایجاد تخصص | تیکا"></Header>
            <AdminDashboard>
                <CreateSpecialty languages={languages} />
            </AdminDashboard>
        </>
    );
}

export default CreateSpecialtyPage;

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
        fetch(`${BASE_URL}/data/language`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return { props: { languages: dataArr[0].data } };
}
