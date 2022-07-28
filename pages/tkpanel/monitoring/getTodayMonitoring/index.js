import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import DoneMonitoring from "../../../../components/AdminDashboard/Main/Content/Monitoring/DoneMonitoring/DoneMonitoring";
import Header from "../../../../components/Head/Head";
import moment from "jalali-moment";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function DoneMonitoringPage({
    token,
    monitorings,
    shamsi_date_obj,
    notAllowed,
}) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="مانیتورینگ انجام شده | تیکا"></Header>
            <AdminDashboard>
                <DoneMonitoring
                    token={token}
                    monitorings={monitorings}
                    shamsi_date_obj={shamsi_date_obj}
                />
            </AdminDashboard>
        </div>
    );
}

export default DoneMonitoringPage;

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

    const date = new Date();
    let startDate = `${date.getFullYear()}-${
        date.getMonth() + 1
    }-${date.getDate()}`;

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/classroom/monitoring/done?date=${startDate}`, {
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
        props: { token, monitorings: dataArr[0].data, shamsi_date_obj },
    };
}
