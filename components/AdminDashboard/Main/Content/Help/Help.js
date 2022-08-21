import { useState } from "react";
import Link from "next/link";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

function Help({ fetchedList: { data, ...restData }, token }) {
    const [list, setList] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));

    const deleteItem = async (id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(`${BASE_URL}/admin/help/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            if (res.ok) {
                showAlert(true, "danger", "این راهنما حذف شد");
                await readList();
            }
        } catch (error) {
            console.log("Error deleting help", error);
        }
        temp = [...loadings];
        temp[i] = false;
        setLoadings(() => temp);
    };

    const readList = async () => {
        try {
            const res = await fetch(`${BASE_URL}/admin/help/all`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const {
                data: { data, ...restData },
            } = await res.json();
            setPagData(restData);
            setList(data);
        } catch (error) {
            console.log("Error reading courses", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    help: "صحفات سایت",
                    admin: "راهنما",
                }}
            />
            <Box
                title="راهنما"
                buttonInfo={{
                    name: "ایجاد",
                    url: "/tkpanel/help/admin/create",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">عنوان</th>
                                <th className="table__head-item">URL</th>
                                <th className="table__head-item">
                                    وضعیت ریدایرکت
                                </th>
                                <th className="table__head-item">
                                    URL ریدایرکت
                                </th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {list?.map((item, i) => (
                                <tr className="table__body-row" key={item?.id}>
                                    <td className="table__body-item">
                                        {item.title}
                                    </td>
                                    <td className="table__body-item">
                                        {item.url}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.redirect_status === 1
                                            ? "1"
                                            : "0"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.redirect_url || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/help/admin/${item?.id}/edit`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() =>
                                                deleteItem(item?.id, i)
                                            }
                                            disabled={loadings[i]}
                                        >
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {list.length !== 0 && (
                    <Pagination read={readList} pagData={pagData} />
                )}
            </Box>

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={deleteItem}
            />
        </div>
    );
}

export default Help;
