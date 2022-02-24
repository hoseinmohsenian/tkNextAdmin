import { useState } from "react";
import Link from "next/link";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import Box from "../Elements/Box/Box";

function Specialities({ specialitys, token }) {
    const [specialities, setSpecialities] = useState(specialitys);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(
        Array(specialitys?.length).fill(false)
    );

    const deleteSpecialty = async (spec_id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/teaching/speciality/${spec_id}`,
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
                showAlert(true, "danger", "این تخصص حذف شد");
                await readSpecialtys();
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting specialty", error);
        }
    };

    const readSpecialtys = async () => {
        try {
            const res = await fetch(`${BASE_URL}/admin/teaching/speciality`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const { data } = await res.json();
            setSpecialities(data);
        } catch (error) {
            console.log("Error reading specialtys", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div>
            <Box
                title="لیست تخصص ها"
                buttonInfo={{
                    name: "ایجاد تخصص",
                    url: "/content/specialty/create",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام زبان</th>
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
                                <th className="table__head-item">توضیحات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {specialities?.map((spec, i) => (
                                <tr className="table__body-row" key={spec?.id}>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/content/specialty/${spec?.id}/edit`}
                                        >
                                            <a className="table__body-link">
                                                {spec?.language_name}
                                            </a>
                                        </Link>
                                    </td>
                                    <td className="table__body-item">
                                        {spec?.persian_name}
                                    </td>
                                    <td className="table__body-item">
                                        {spec?.english_name}
                                    </td>
                                    <td className="table__body-item">
                                        {spec?.url}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/content/specialty/${spec?.id}`}
                                        >
                                            <a className={`action-btn primary`}>
                                                افزودن&nbsp;
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/content/specialty/${spec?.id}/edit`}
                                        >
                                            <a className={`action-btn warning`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn danger`}
                                            onClick={() =>
                                                deleteSpecialty(spec?.id, i)
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
                envoker={deleteSpecialty}
            />
        </div>
    );
}

export default Specialities;
