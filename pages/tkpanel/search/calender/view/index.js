import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import TeachersFreeHours from "../../../../../components/AdminDashboard/Main/Content/Support/TeachersFreeHours/TeachersFreeHours";
import Header from "../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";

function TeachersFreeHoursPage({ languages, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="ساعت خالی استاد | تیکا"></Header>
            <AdminDashboard>
                <TeachersFreeHours languages={languages} />
            </AdminDashboard>
        </div>
    );
}

export default TeachersFreeHoursPage;

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
        fetch(`${BASE_URL}/data/language`, {
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

    return { props: { languages: dataArr[0].data } };
}
