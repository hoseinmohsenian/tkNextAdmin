import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import TodayMonitoring from "../../../../components/AdminDashboard/Main/Content/Monitoring/TodayMonitoring/TodayMonitoring";
import Header from "../../../../components/Head/Head";
import moment from "jalali-moment";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function TodayMonitoringPage({
    token,
    monitorings,
    shamsi_date_obj,
    admins,
    notAllowed,
}) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="مانیتورینگ امروز | تیکا"></Header>
            <AdminDashboard>
                <TodayMonitoring
                    token={token}
                    monitorings={monitorings}
                    shamsi_date_obj={shamsi_date_obj}
                    admins={admins}
                />
            </AdminDashboard>
        </div>
    );
}

export default TodayMonitoringPage;

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

    const formatNumber = (number) =>
        number.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
        });

    const date = new Date();
    let startDate = `${formatNumber(date.getFullYear())}-${formatNumber(
        date.getMonth() + 1
    )}-${formatNumber(date.getDate())}`;

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/classroom/monitoring?date=${startDate}`, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/admin/management/return`, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
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

    let shamsi_date = moment
        .from(`${startDate.substring(0, 10)}`, "en", "YYYY/MM/DD")
        .locale("fa")
        .format("YYYY/MM/DD");
    let shamsi_date_obj = {
        year: Number(shamsi_date?.substring(0, 4)),
        month: Number(shamsi_date?.substring(5, 7)),
        day: Number(shamsi_date?.substring(8, 10)),
    };

    return {
        props: {
            token,
            monitorings: dataArr[0].data,
            shamsi_date_obj,
            admins: dataArr[1].data,
        },
    };
}
