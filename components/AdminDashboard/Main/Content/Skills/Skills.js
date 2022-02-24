import { useState } from "react";
import Link from "next/link";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import Box from "../Elements/Box/Box";

function Skills({ fetchedSkills, token }) {
    const [skills, setSkills] = useState(fetchedSkills);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(
        Array(fetchedSkills?.length).fill(false)
    );

    const deleteSkill = async (skill_id, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);
        try {
            const res = await fetch(
                `${BASE_URL}/admin/teaching/skill/${skill_id}`,
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
                showAlert(true, "danger", "این مهارت حذف شد");
                await readSkills();
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error deleting skills", error);
        }
    };

    const readSkills = async () => {
        try {
            const res = await fetch(`${BASE_URL}/admin/teaching/skill`, {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const { data } = await res.json();
            setSkills(data);
        } catch (error) {
            console.log("Error reading skills", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    return (
        <div>
            <Box
                title="لیست مهارت ها"
                buttonInfo={{
                    name: "ایجاد مهارت",
                    url: "/content/skill/create",
                    color: "primary",
                }}
            ></Box>

            <div className="table__wrapper">
                <table className="table">
                    <thead className="table__head">
                        <tr>
                            <th className="table__head-item">نام تخصص</th>
                            <th className="table__head-item">عنوان فارسی</th>
                            <th className="table__head-item">عنوان انگلیسی</th>
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
                        {skills?.map((sk, i) => (
                            <tr className="table__body-row" key={sk?.id}>
                                <td className="table__body-item">
                                    <Link
                                        href={`/content/skill/${sk?.id}/edit`}
                                    >
                                        <a className="table__body-link">
                                            {sk?.speciality_name}
                                        </a>
                                    </Link>
                                </td>
                                <td className="table__body-item">
                                    {sk?.persian_name}
                                </td>
                                <td className="table__body-item">
                                    {sk?.english_name}
                                </td>
                                <td className="table__body-item">{sk?.url}</td>
                                <td className="table__body-item">
                                    <Link href={`/content/skill/${sk?.id}`}>
                                        <a className={`action-btn primary`}>
                                            افزودن&nbsp;
                                        </a>
                                    </Link>
                                    <Link
                                        href={`/content/skill/${sk?.id}/edit`}
                                    >
                                        <a className={`action-btn warning`}>
                                            ویرایش
                                        </a>
                                    </Link>
                                    <button
                                        type="button"
                                        className={`action-btn danger`}
                                        onClick={() => deleteSkill(sk?.id, i)}
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

            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={deleteSkill}
            />
        </div>
    );
}

export default Skills;
