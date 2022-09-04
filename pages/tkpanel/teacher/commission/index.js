import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import Commission from "../../../../components/AdminDashboard/Main/Content/TeacherSide/Commission/Commission";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function CommissionsPage({ commissions, token, notAllowed, searchData }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="لیست کمیسیون متغیر استاد | تیکا"></Header>
            <AdminDashboard>
                <Commission
                    fetchedCommissions={commissions}
                    token={token}
                    searchData={searchData}
                />
            </AdminDashboard>
        </div>
    );
}

export default CommissionsPage;

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

    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    const { teacher_name, user_name, page } = context?.query;
    let searchData = {
        teacher_name: "",
        user_name: "",
    };
    let searchQuery = "";

    if (isKeyValid(teacher_name)) {
        searchQuery += `teacher_name=${teacher_name}&`;
        searchData = { ...searchData, teacher_name: teacher_name };
    }
    if (isKeyValid(user_name)) {
        searchQuery += `user_name=${user_name}&`;
        searchData = { ...searchData, user_name: user_name };
    }
    if (isKeyValid(page)) {
        searchQuery += `page=${page}&`;
    }

    const responses = await Promise.all([
        fetch(
            `${BASE_URL}/admin/teacher/changeable/commission?${searchQuery}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        ),
    ]);

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            commissions: dataArr[0].data,
            token,
            searchData,
        },
    };
}
