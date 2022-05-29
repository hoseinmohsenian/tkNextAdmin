import { useState } from "react";
import Link from "next/link";
import Box from "../Elements/Box/Box";
import Pagination from "../Pagination/Pagination";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import Alert from "../../../../Alert/Alert";
import { BASE_URL } from "../../../../../constants";

function GroupClass(props) {
    const {
        fetchedClasses: { data, ...restData },
        token,
    } = props;
    const [classes, setClasses] = useState(data);
    const [pagData, setPagData] = useState(restData);
    const router = useRouter();
    const [loadings, setLoadings] = useState(Array(data?.length).fill(false));
    const [alertData, setAlertData] = useState({
        show: false,
        message: "",
        type: "",
    });
    moment.locale("fa", { useGregorianParser: true });

    const readClasses = async (page = 1) => {
        let searchParams = {};

        if (page !== 1) {
            searchParams = {
                ...searchParams,
                page,
            };
        }

        router.push({
            pathname: `/tkpanel/groupClass`,
            query: searchParams,
        });

        try {
            const res = await fetch(`${BASE_URL}/admin/group-class/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
            const {
                data: { data, ...restData },
            } = await res.json();
            setClasses(data);
            setPagData(restData);
            // Scroll to top
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        } catch (error) {
            console.log("Error reading group-classes", error);
        }
    };

    const showAlert = (show, type, message) => {
        setAlertData({ show, type, message });
    };

    const changeStatus = async (class_id, status, i) => {
        loadingHandler(i, true);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/group-class/${class_id}`,
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
                let message = `این کلاس ${
                    status === 0 ? "فعال" : "غیرفعال"
                } شد`;
                showAlert(true, status === 0 ? "success" : "warning", message);
                let updated = [...classes];
                updated[i] = { ...updated[i], status: status === 0 ? 1 : 0 };
                setClasses(() => updated);
            }
            loadingHandler(i, false);
        } catch (error) {
            console.log("Error changing status", error);
        }
    };

    const changeShow = async (class_id, show, i) => {
        loadingHandler(i, true);

        try {
            const res = await fetch(
                `${BASE_URL}/admin/group-class/${class_id}`,
                {
                    method: "POST",
                    body: JSON.stringify({ show: show === 0 ? 1 : 0 }),
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            if (res.ok) {
                let message = `این کلاس ${show === 0 ? "نمایان" : "پنهان"} شد`;
                showAlert(true, show === 0 ? "success" : "warning", message);
                let updated = [...classes];
                updated[i] = { ...updated[i], show: show === 0 ? 1 : 0 };
                setClasses(() => updated);
            }
            loadingHandler(i, false);
        } catch (error) {
            console.log("Error changing show", error);
        }
    };

    const loadingHandler = (ind, value) => {
        let temp = [...loadings];
        temp[ind] = value;
        setLoadings(() => temp);
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
                title="لیست کلاس های گروهی"
                buttonInfo={{
                    name: "ایجاد کلاس گروهی",
                    url: "/tkpanel/groupClass/create",
                    color: "primary",
                }}
            >
                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">عنوان</th>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">زبان‌</th>
                                <th className="table__head-item">کمیسیون</th>
                                <th className="table__head-item">مدت کلاس</th>
                                <th className="table__head-item">ظرفیت</th>
                                <th className="table__head-item">تاریخ شروع</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {classes?.map((cls, i) => (
                                <tr className="table__body-row" key={cls.id}>
                                    <td className="table__body-item">
                                        {cls.title}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {cls.language_name}
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {cls.commission}%
                                    </td>
                                    <td className="table__body-item">
                                        {cls.session_time} دقیقه
                                    </td>
                                    <td className="table__body-item">
                                        {cls.class_capacity} نفر
                                    </td>
                                    <td className="table__body-item table__body-item--ltr">
                                        {cls.start_date
                                            ? moment
                                                  .from(
                                                      cls.start_date
                                                          .replace("-", "/")
                                                          .replace("-", "/"),
                                                      "en",
                                                      "YYYY/MM/DD"
                                                  )
                                                  .locale("fa")
                                                  .format("YYYY/MM/DD")
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/groupClass/${cls?.id}/edit`}
                                        >
                                            <a className={`action-btn primary`}>
                                                ویرایش
                                            </a>
                                        </Link>
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                cls?.status === 1
                                                    ? "danger"
                                                    : "success"
                                            }`}
                                            onClick={() =>
                                                changeStatus(
                                                    cls?.id,
                                                    cls?.status,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            {cls?.status === 1
                                                ? "غیرفعال"
                                                : "فعال"}
                                        </button>
                                        <button
                                            type="button"
                                            className={`action-btn ${
                                                cls?.show === 1
                                                    ? "danger"
                                                    : "success"
                                            }`}
                                            onClick={() =>
                                                changeShow(
                                                    cls?.id,
                                                    cls?.show,
                                                    i
                                                )
                                            }
                                            disabled={loadings[i]}
                                        >
                                            {cls?.show === 1
                                                ? "پنهان"
                                                : "نمایش"}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {classes.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={12}
                                    >
                                        کلاسی پیدا نشد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {classes.length !== 0 && (
                    <Pagination read={readClasses} pagData={pagData} />
                )}
            </Box>
        </div>
    );
}

export default GroupClass;
