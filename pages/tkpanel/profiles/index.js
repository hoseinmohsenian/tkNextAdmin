import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Profiles from "../../../components/AdminDashboard/Main/Content/Profiles/Profiles";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function ProfilesPage({ students, token, searchData, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="زبان آموزان | تیکا"></Header>
            <AdminDashboard>
                <Profiles
                    token={token}
                    fetchedStudents={students}
                    searchData={searchData}
                />
            </AdminDashboard>
        </div>
    );
}

export default ProfilesPage;

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
    const { input, page } = context?.query;
    let params = "";
    let searchData = {
        input: "",
    };

    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            params += `page=${page}&`;
        }
    }
    if (isKeyValid(input)) {
        params += `input=${input}&`;
        searchData = { ...searchData, input };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/student/search?${params}`, {
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
        props: { students: dataArr[0]?.data, token, searchData },
    };
}
