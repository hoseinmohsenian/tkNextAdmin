import AdminDashboard from "../../../../components/AdminDashboard/Dashboard";
import AddDiscount from "../../../../components/AdminDashboard/Main/Content/Discount/AddDiscount/AddDiscount";
import Header from "../../../../components/Head/Head";

function AddDiscountPage() {
    return (
        <>
            <Header title="ایجاد کوپن تخفیف | تیکا"></Header>
            <AdminDashboard>
                <AddDiscount />
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

    return {
        props: {},
    };
}
