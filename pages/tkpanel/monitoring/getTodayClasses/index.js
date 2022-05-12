import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import TodayMonitoring from "../../../../components/AdminDashboard/Main/Content/Monitoring/TodayMonitoring/TodayMonitoring";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";
import moment from "jalali-moment";

function TodayMonitoringPage({ token, monitorings, shamsi_date_obj }) {
    return (
        <div>
            <Header title="مانیتورینگ امروز | تیکا"></Header>
            <AdminDashboard>
                <TodayMonitoring
                    token={token}
                    monitorings={monitorings}
                    shamsi_date_obj={shamsi_date_obj}
                />
            </AdminDashboard>
        </div>
    );
}

export default TodayMonitoringPage;

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

    const date = new Date();
    let startDate = `${date.getFullYear()}-${
        date.getMonth() + 1
    }-${date.getDate()}`;

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/classroom/monitoring?date=${startDate}`, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    let shamsi_date = moment
        .from(`${startDate.substring(0, 8)}`, "en", "YYYY/MM/DD")
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
