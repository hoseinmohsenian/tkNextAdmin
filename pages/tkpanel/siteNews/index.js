import AdminDashboard from "../../../components/AdminDashboard/Dashboard";
import Articles from "../../../components/AdminDashboard/Main/Content/Articles/Articles";
import Header from "../../../components/Head/Head";
import { BASE_URL } from "../../../constants";
import { checkResponseArrAuth } from "../../../utils/helperFunctions";
import NotAuthorized from "../../../components/Errors/NotAuthorized/NotAllowed";

function ArticlesPage({
    articles,
    token,
    languages,
    admins,
    searchData,
    notAllowed,
}) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="لیست مقالات | تیکا"></Header>
            <AdminDashboard>
                <Articles
                    fetchedArticles={articles}
                    token={token}
                    languages={languages}
                    admins={admins}
                    searchData={searchData}
                />
            </AdminDashboard>
        </div>
    );
}

export default ArticlesPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    const findItem = (list, key, target) =>
        list.find((item) => item[key] === target);
    const { title, language, draft, admin, order_by, page } = context?.query;
    let searchData = {
        title: "",
        language_id: 0,
        draft: 0,
        admin_id: 0,
        order_by: "",
    };

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
        fetch(`${BASE_URL}/admin/blog/article/all/admin`, {
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
    let languages = dataArr[0].data,
        admins = dataArr[1].data;

    let searchParams = "";

    if (isKeyValid(language)) {
        const theLanguage = findItem(languages, "english_name", language);
        if (theLanguage) {
            searchParams += `language_id=${theLanguage?.id}&`;
            searchData = { ...searchData, language_id: theLanguage?.id };
        }
    }
    if (isKeyValid(admin)) {
        const theAdmin = findItem(admins, "name", admin);
        if (theAdmin) {
            searchParams += `admin_id=${theAdmin?.id}&`;
            searchData = { ...searchData, admin_id: theAdmin?.id };
        }
    }
    if (isKeyValid(title)) {
        searchParams += `title=${title}&`;
        searchData = { ...searchData, title: title };
    }
    if (isKeyValid(draft)) {
        searchParams += `draft=${draft}&`;
        searchData = { ...searchData, draft: draft };
    }
    if (isKeyValid(order_by)) {
        if (
            order_by.toLowerCase() === "desc" ||
            order_by.toLowerCase() === "asc"
        ) {
            searchParams += `order_by=${order_by}&`;
            searchData = { ...searchData, order_by: order_by };
        }
    }
    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            searchParams += `page=${page}`;
            searchData = { ...searchData, page: page };
        }
    }

    const res = await fetch(`${BASE_URL}/admin/blog/article?${searchParams}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    });

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const { data: articles } = await res.json();

    return {
        props: {
            articles,
            token,
            languages,
            admins,
            searchData,
        },
    };
}
