import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import SemiPrivate from "../../../components/AdminDashboard/Main/Content/SemiPrivate/SemiPrivate";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function GroupClassPage({ classes, token, notAllowed, languages, searchData }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <>
            <Header title="لیست کلاس های نیمه خصوصی | تیکا"></Header>
            <AdminDashboard>
                <SemiPrivate
                    fetchedClasses={classes}
                    token={token}
                    languages={languages}
                    searchData={searchData}
                />
            </AdminDashboard>
        </>
    );
}

export default GroupClassPage;

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

    const res = await Promise.all([
        fetch(`${BASE_URL}/data/language`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);
    const data = await Promise.all(res.map((res) => res.json()));
    let languages = data[0].data;

    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    const findItem = (list, key, target) =>
        list.find((item) => item[key] === target);
    const { teacher_name, language_id, page } = context?.query;
    let searchQuery = "";
    let searchData = {
        language_id: "",
        teacher_name: "",
    };

    if (isKeyValid(teacher_name)) {
        searchQuery += `teacher_name=${teacher_name}&`;
        searchData = { ...searchData, teacher_name };
    }
    if (isKeyValid(language_id)) {
        const theLanguage = findItem(languages, "id", Number(language_id));
        if (theLanguage) {
            searchQuery += `language_id=${theLanguage?.id}&`;
            searchData = { ...searchData, language_id: theLanguage?.id };
        }
    }
    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            params += `page=${page}&`;
        }
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/semi-private?${searchQuery}`, {
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
            classes: dataArr[0].data,
            token,
            languages,
            searchData,
        },
    };
}
