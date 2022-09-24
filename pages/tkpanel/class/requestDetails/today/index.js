import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import TodayClass from "../../../../../components/AdminDashboard/Main/Content/PrivateClass/TodayClass/TodayClass";
import Header from "../../../../../components/Head/Head";
import { checkResponseArrAuth } from "../../../../../utils/helperFunctions";
import NotAuthorized from "../../../../../components/Errors/NotAuthorized/NotAllowed";
import moment from "jalali-moment";

function TodayClassPage({ classes, meta, notAllowed, shamsi_date_obj }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="کلاس های امروز | تیکا"></Header>
            <AdminDashboard>
                <TodayClass
                    fetchedClasses={classes}
                    fetchedMeta={meta}
                    shamsi_date_obj={shamsi_date_obj}
                />
            </AdminDashboard>
        </div>
    );
}

export default TodayClassPage;

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

    const formatNumber = (num) => {
        return num.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });
    };

    const date = new Date();
    let startDate = `${formatNumber(date.getFullYear())}-${formatNumber(
        date.getMonth() + 1
    )}-${formatNumber(date.getDate())}`;

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/classroom/today?date=${startDate}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    let shamsi_date = moment
        .from(`${startDate.substring(0, 10)}`, "en", "YYYY/MM/DD")
        .locale("fa")
        .format("YYYY/MM/DD");
    let shamsi_date_obj = {
        year: Number(shamsi_date?.substring(0, 4)),
        month: Number(shamsi_date?.substring(5, 7)),
        day: Number(shamsi_date?.substring(8, 10)),
    };

    if (!checkResponseArrAuth(responses)) {
        return {
            props: { notAllowed: true },
        };
    }

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            classes: dataArr[0].data,
            meta: dataArr[0].meta,
            shamsi_date_obj,
        },
    };
}
