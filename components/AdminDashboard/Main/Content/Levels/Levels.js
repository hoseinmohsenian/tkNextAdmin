import { useState } from "react";
import Link from "next/link";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import Box from "../Elements/Box/Box";
import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";

function Levels({ fetchedLevels, token }) {
    const [levels, setLevels] = useState(fetchedLevels);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(
        Array(fetchedLevels?.length).fill(false)
    );

    const deleteLevel = async (level_id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/teaching/level/${level_id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(true, "danger", "این سطح حذف شد");
                await readLevels();
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting level", error);
        }
    };

    const readLevels = async () => {
        try {
            const res = await fetch(`${BASE_URL}/admin/teaching/level`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const { data } = await res.json();
            setLevels(data);
        } catch (error) {
            console.log("Error reading levels", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div>
            <BreadCrumbs
                substituteObj={{
                    content: "محتوا",
                    level: "سطح ها",
                }}
            />
            <Box
                title="لیست سطح ها"
                buttonInfo={{
                    name: "ایجاد سطح",
                    url: "/content/level/create",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">
                                    عنوان فارسی
                                </th>
                                <th className="table__head-item">
                                    عنوان انگلیسی
                                </th>
                                <th
                                    className="table__head-item"
                                    style={{ fontSize: "1rem" }}
                                >
                                    url
                                </th>
                                <th
                                    className="table__head-item"
                                    style={{ fontSize: "1rem" }}
                                >
                                    توضیحات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {levels?.map((lv, i) => (
                                <tr className="table__body-row" key={lv?.id}>
                                    <td className="table__body-item">
                                        {lv?.persian_name}
                                    </td>
                                    <td className="table__body-item">
                                        {lv?.english_name}
                                    </td>
                                    <td className="table__body-item">
                                        {lv?.url}
                                    </td>
                                    <td className="table__body-item">
                                        <Link href={`/content/level/${lv?.id}`}>
                                            <a className={`action-btn primary`}>
                                                افزودن&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/content/level/${lv?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() =>
                                                deleteLevel(lv?.id, i)
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
            </Box>

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={deleteLevel}
            />
        </div>
    );
}

export default Levels;
