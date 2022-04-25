import AdminDashboard from "../../../../../components/AdminDashboard/Dashboard";
import EditDiscount from "../../../../../components/AdminDashboard/Main/Content/Discount/EditDiscount/EditDiscount";
import Header from "../../../../../components/Head/Head";
import { BASE_URL } from "../../../../../constants";

function EditDiscountPage({ discount, token, courses }) {
    return (
        <>
            <Header title="ویرایش کوپن تخفیف | تیکا"></Header>
            <AdminDashboard>
                <EditDiscount
                    discount={discount}
                    token={token}
                    courses={courses}
                />
            </AdminDashboard>
        </>
    );
}

export default EditDiscountPage;

export async function getServerSideProps(context) {
    const token = context.req.cookies["admin_token"];
    const id = context.params.id;

    if (!token) {
        return {
            redirect: {
                destination: "/tkcp/login",
                permanent: false,
            },
        };
    }

    const responses = await Promise.all([
        fetch(`${BASE_URL}/admin/discount/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
        fetch(`${BASE_URL}/data/course`, {
            headers: {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        }),
    ]);

    const dataArr = await Promise.all(responses.map((res) => res.json()));

    return {
        props: {
            discount: dataArr[0].data,
            courses: dataArr[1].data,
            token,
        },
    };
}
