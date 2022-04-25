import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import AddDiscount from "../../../../components/AdminDashboard/Main/Content/Discount/AddDiscount/AddDiscount";
import Header from "../../../../components/Head/Head";
import { BASE_URL } from "../../../../constants";

function AddDiscountPage({ token, courses }) {
    return (
        <>
            <Header title="ایجاد کوپن تخفیف | تیکا"></Header>
            <AdminDashboard>
                <AddDiscount token={token} courses={courses} />
            </AdminDashboard>
        </>
    );
}

export default AddDiscountPage;

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

    const responses = await Promise.all([
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
            courses: dataArr[0].data,
            token,
        },
    };
}
