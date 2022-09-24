import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import AddNewClass from "../../../../components/AdminDashboard/Main/Content/PrivateClass/AddNewClass/AddNewClass";
import Header from "../../../../components/Head/Head";
import moment from "jalali-moment";

function MultiSessionPage({ token, day, schedulerData }) {
    return (
        <div>
            <Header title="ایجاد کلاس جدید | تیکا"></Header>
            <AdminDashboard>
                <AddNewClass
                    token={token}
                    day={day}
                    schedulerData={schedulerData}
                />
            </AdminDashboard>
        </div>
    );
}

export default MultiSessionPage;

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
    let start = `${date.getFullYear()}-${
        date.getMonth() + 1
    }-${date.getDate()}`;
    const nextWeek = new Date(
        new Date(start).getTime() + 7 * 24 * 60 * 60 * 1000
    );
    let end = `${nextWeek.getFullYear()}-${
        nextWeek.getMonth() + 1
    }-${nextWeek.getDate()}`;

    const responses = await Promise.all([
        fetch(
            `${BASE_URL}/admin/teacher/calendar/16?start=${start}&end=${end}`,
            {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            }
        ),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));
    const day11 = addTask(dataArr);
    return {
        props: {
            token,
            day: day11,
            schedulerData: dataArr[0].data,
        },
    };
}

function addTask(dataArr) {
    let times = [];
    moment.locale("fa", { useGregorianParser: true });
    console.log(times);
    // Constructing times array for time filter inputs
    const m = moment();
    m.set("hour", 24);
    m.set("minute", 0);
    for (let i = 1; i <= 48; i++) {
        let startHour = m.format("HH");
        let startMinute = m.format("mm");
        m.add(30, "minute");
        let endHour = m.format("HH");
        let endMinute = m.format("mm");
        let newItem = { key: i, startHour, startMinute, endHour, endMinute };
        times.push(newItem);
    }

    var allResults = [];
    const dayKeys = Object.keys(dataArr[3].data);
    Object.values(dataArr[3].data).map(function (data, i) {
        let dateItem = { start_date: "", end_date: "" };

        data.map((timeItem) => {
            dateItem = {
                start_date: `${dayKeys[i]} ${
                    times[timeItem.time[0] - 1].startHour
                }:${times[timeItem.time[0] - 1].startMinute}`,
                end_date: `${dayKeys[i]} ${
                    times[timeItem.time[timeItem.time.length - 1] - 1].endHour
                }:${
                    times[timeItem.time[timeItem.time.length - 1] - 1].endMinute
                }`,
            };
            allResults.push(dateItem);
        });
    });

    return allResults;
}
