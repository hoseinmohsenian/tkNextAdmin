import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import TeacherWithdrawalRequests from "../../../../components/AdminDashboard/Main/Content/Accounting/TeacherWithdrawalRequests/TeacherWithdrawalRequests";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";
import { checkResponseArrAuth } from "../../../../utils/helperFunctions";
import NotAuthorized from "../../../../components/Errors/NotAuthorized/NotAllowed";

function TeacherWithdrawalRequestsPage({ token, requests, notAllowed }) {
    if (!!notAllowed) {
        return <NotAuthorized />;
    }
    return (
        <div>
            <Header title="درخواست تسویه اساتید | تیکا"></Header>
            <AdminDashboard>
                <TeacherWithdrawalRequests
                    token={token}
                    fetchedRequests={requests}
                />
            </AdminDashboard>
        </div>
    );
}

export default TeacherWithdrawalRequestsPage;

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
        fetch(`${BASE_URL}/admin/accounting/withdrawal?${searchParams}`, {
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
            // requests: dataArr[0].data,
            requests: {
                current_page: 1,
                data: [
                    {
                        id: 3,
                        teacher_id: 16,
                        teacher_account_id: 482,
                        amount: 200000,
                        pay_time: null,
                        created_at: "2022-03-28T09:41:08.000000Z",
                        teacher_name: "زینب ناصری",
                        account: {
                            id: 482,
                            teacher_id: 16,
                            card_number: "1234567890123456",
                            sheba_number: "1000000000039238982931",
                            bank_name: "صادرات",
                            name: "علی کاظمی",
                            admin_verified: 0,
                            created_at: "2022-03-28T08:14:48.000000Z",
                            updated_at: "2022-03-28T08:14:48.000000Z",
                        },
                    },
                    {
                        id: 2,
                        teacher_id: 16,
                        teacher_account_id: 480,
                        amount: 200000,
                        pay_time: null,
                        created_at: "2022-03-28T09:40:03.000000Z",
                        teacher_name: "زینب ناصری",
                        account: {
                            id: 480,
                            teacher_id: 16,
                            card_number: "5859831140033050",
                            sheba_number: "IR720180000000003397804778",
                            bank_name: "تجارت",
                            name: null,
                            admin_verified: 1,
                            created_at: "2022-03-16T14:12:59.000000Z",
                            updated_at: "2022-03-16T14:12:59.000000Z",
                        },
                    },
                ],
                first_page_url:
                    "http://localhost/tikka_api/public/api/admin/accounting/withdrawal?page=1",
                from: 1,
                last_page: 1,
                last_page_url:
                    "http://localhost/tikka_api/public/api/admin/accounting/withdrawal?page=1",
                links: [
                    {
                        url: null,
                        label: "&laquo; صفحه قبل",
                        active: false,
                    },
                    {
                        url: "http://localhost/tikka_api/public/api/admin/accounting/withdrawal?page=1",
                        label: "1",
                        active: true,
                    },
                    {
                        url: null,
                        label: "صفحه بعد &raquo;",
                        active: false,
                    },
                ],
                next_page_url: null,
                path: "http://localhost/tikka_api/public/api/admin/accounting/withdrawal",
                per_page: 50,
                prev_page_url: null,
                to: 2,
                total: 2,
            },
            token,
        },
    };
}
