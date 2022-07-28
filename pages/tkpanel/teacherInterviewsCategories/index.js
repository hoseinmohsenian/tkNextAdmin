import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import TeacherInterview from "../../../components/AdminDashboard/Main/Content/TeacherInterview/TeacherInterview";
import Header from "../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function TeacherInterviewPage({ teachers, token, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="مصاحبه با اساتید | تیکا"></Header>
            <AdminDashboard>
                <TeacherInterview token={token} teachers={teachers} />
            </AdminDashboard>
        </div>
    );
}

export default TeacherInterviewPage;

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

    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    const { page } = context?.query;
    let params = "";

    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            params += `page=${page}`;
        }
    }

    // const responses = await Promise.all([
    //     fetch(`${BASE_URL}/admin/student/search?${params}`, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             "Content-type": "application/json",
    //             "Access-Control-Allow-Origin": "*",
    //         },
    //     }),
    // ]);

    // if (!checkResponseArrAuth(responses)) {
    //     return {
    //         props: { notAllowed: true },
    //     };
    // }

    // const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        // props: { students: dataArr[0]?.data, token, searchData },
        props: { teachers: [], token },
    };
}
