import { useState } from "react";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";
import { useGlobalContext } from "../../../../../context";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import Box from "../Elements/Box/Box";

function Teachers({ fetchedTeachers: { data, ...restData }, token }) {
    const [teachers, setTeachers] = useState(data);
    const [formData, setFormData] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const { generateKey } = useGlobalContext();
    const router = useRouter();

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const changeStatus = async (teacher_id, status, i) => {
        let temp = [...loadings];
        temp[i] = true;
        setLoadings(() => temp);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/teacher/status/${teacher_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ status: status === 0 ? 1 : 0 }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = `این کاربر ${
                    status === 0 ? "فعال" : "غیرفعال"
                } شد`;
                showAlert(true, status === 0 ? "success" : "danger", message);
                await readTeachers(pagData?.current_page);
            }
            let temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error changing status", error);
        }
    };

    const readTeachers = async (page = 1) => {
        if (page !== 1) {
            router.push({
                pathname: `/tkpanel/teachers`,
                query: { page },
            });
        }

        try {
            let params = `page=${page}`;
            const res = await fetch(`${BASE_URL}/admin/teacher?${params}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const {
                data: { data, ...restData },
            } = await res.json();
            setTeachers(data);
            setFormData(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading teachers", error);
        }
    };

    const handleOnChange = (e, rowInd, name) => {
        let updated = [...formData];
        updated[rowInd] = { ...updated[rowInd], [name]: e.target.value };
        setFormData(() => updated);
    };

    const changeCommission = async (e, teacher_id, i) => {
        try {
            let temp = [...loadings];
            temp[i] = true;
            setLoadings(() => temp);

            const res = await fetch(
                `${BASE_URL}/admin/teacher/commission/${teacher_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ commission: e.target.value }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = `کمیسیون به ${e.target.value} تغییر کرد`;
                showAlert(true, "success", message);
            }

            temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error changing commission", error);
        }
    };

    const changeCommissionHandler = async (e, teacher_id, i) => {
        if (
            Number(e.target.value) !== teachers[i]?.commission &&
            e.target.value
        ) {
            await changeCommission(e, teacher_id, i);
            let temp = [...teachers];
            temp[i]?.commission = Number(e.target.value);
            setTeachers(() => temp);
        }
    };

    const addDesc = async (e, teacher_id, i) => {
        try {
            let temp = [...loadings];
            temp[i] = true;
            setLoadings(() => temp);

            const res = await fetch(
                `${BASE_URL}/admin/teacher/desc/${teacher_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ admin_desc: e.target.value }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                showAlert(true, "success", e.target.value?"توضیحات اضافه شد":"توضیحات برداشته شد");
            }

            temp = [...loadings];
            temp[i] = false;
            setLoadings(() => temp);
        } catch (error) {
            console.log("Error adding description", error);
        }
    };

    const addDescHandler = async (e, teacher_id, i) => {
        if (e.target.value !== teachers[i]?.admin_desc) {
            await addDesc(e, teacher_id, i);
            let temp = [...teachers];
            temp[i]?.admin_desc = (e.target.value);
            setTeachers(() => temp);
        }
    };

    return (
        <div>
            {/* Alert */}
            <Alert
                {...alertData}
                removeAlert={showAlert}
                envoker={changeStatus}
            />
            <Box
                title="لیست اساتید"
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">نام</th>
                                <th className="table__head-item">نام خانوادگی</th>
                                <th className="table__head-item">موبایل</th>
                                <th className="table__head-item">زبان</th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">توضیحات ادمین</th>
                                <th className="table__head-item">استپ</th>
                                <th className="table__head-item">کمیسیون</th>
                                <th className="table__head-item">ویدئو</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {teachers?.map((teacher, i) => (
                                <tr className="table__body-row" key={teacher?.id}>
                                    <td className="table__body-item">
                                        {teacher?.name}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.family}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.mobile || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.language_name?.map((lan, ind) => (
                                            <span
                                                key={generateKey(lan?.english_name)}
                                            >
                                                {lan?.persian_name}&nbsp;
                                                {ind !==
                                                    teacher?.language_name?.length -
                                                        1 && <span>&#8226;</span>}
                                                &nbsp;
                                            </span>
                                        ))}
                                        {teacher?.language_name?.length === 0 && (
                                            <span>-</span>
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.status === 1
                                            ? "فعال"
                                            : "غیر فعال"}
                                    </td>
                                    <td className="table__body-item">
                                        <div className="form-control" style={{width:"130px",margin:0}}>
                                            <input
                                                type="text"
                                                name="admin_desc"
                                                id="admin_desc"
                                                className="form__input"
                                                onChange={(e) =>
                                                    handleOnChange(
                                                        e,
                                                        i,
                                                        "admin_desc"
                                                    )
                                                }
                                                value={formData[i]?.admin_desc || ""}
                                                onBlur={(e) =>
                                                    addDescHandler(
                                                        e,
                                                        teacher?.id,
                                                        i
                                                    )
                                                }
                                                disabled={loadings[i]}
                                                autoComplete="off"
                                                spellCheck={false}
                                                required
                                            />
                                        </div>
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.step}
                                    </td>
                                    <td className="table__body-item">
                                        <div className="form-control" style={{width:"60px",margin:0}}>
                                            <input
                                                type="number"
                                                name="commission"
                                                id="commission"
                                                className="form__input"
                                                onChange={(e) =>
                                                    handleOnChange(
                                                        e,
                                                        i,
                                                        "commission"
                                                    )
                                                }
                                                value={formData[i]?.commission || ""}
                                                onBlur={(e) =>
                                                    changeCommissionHandler(
                                                        e,
                                                        teacher?.id,
                                                        i
                                                    )
                                                }
                                                disabled={loadings[i]}
                                                autoComplete="off"
                                                spellCheck={false}
                                                required
                                            />
                                        </div>
                                    </td>
                                    <td className="table__body-item">
                                        {teacher?.video ? "دارد" : "ندارد"}
                                    </td>
                                    <td className="table__body-item">
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                teacher?.status === 1
                                                    ?"danger"
                                                    : "success"
                                            }`}
                                            onClick={() =>
                                                changeStatus(
                                                    teacher?.id,
                                                    teacher?.status,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            {teacher?.status === 0
                                                ? "فعال"
                                                : "غیر فعال"}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </Box>

            {teachers && (
                <Pagination read={readTeachers} pagData={pagData} />
            )}
        </div>
    );
}

export default Teachers;
