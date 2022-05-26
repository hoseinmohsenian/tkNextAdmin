import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import NotHeldClasses from "../../../../components/AdminDashboard/Main/Content/NotHeldClasses/NotHeldClasses";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function NotHeldClassesPage({ classes, token }) {
    return (
        <>
            <Header title="لیست کلاس های برگزار نشده | تیکا"></Header>
            <AdminDashboard>
                <NotHeldClasses fetchedClasses={classes} token={token} />
            </AdminDashboard>
        </>
    );
}

export default NotHeldClassesPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const { page } = context?.query;
    const isKeyValid = (key) => Number(key) !== 0 && key !== undefined;
    let searchParams = "";

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    if (isKeyValid(page)) {
        if (Number(page) > 0) {
            searchParams += `page=${page}`;
        }
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/classroom/not-held?${searchParams}`, {
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
            classes: dataArr[0].data,
            token,
        },
    };
}
