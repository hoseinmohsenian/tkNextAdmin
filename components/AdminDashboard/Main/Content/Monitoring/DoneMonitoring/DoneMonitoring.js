import { useState } from "react";
import { BASE_URL } from "../../../../../../constants";
import Box from "../../Elements/Box/Box";
import styles from "./DoneMonitoring.module.css";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import moment from "jalali-moment";
import Link from "next/link";
import { useGlobalContext } from "../../../../../../context";

function DoneMonitoring({ token, monitorings, shamsi_date_obj }) {
    const [monitoringList, setMonitoringList] = useState(monitorings);
    const [selectedDate, setSelectedDate] = useState(shamsi_date_obj);
    const [loading, setLoading] = useState(false);
    moment.locale("fa", { useGregorianParser: true });
    const { getTime } = useGlobalContext();

    const readMonitoring = async () => {
        // Constructing search parameters
        let searchQuery = "";
        let date = moment
            .from(
                `${selectedDate?.year}/${selectedDate?.month}/${selectedDate?.day}`,
                "fa",
                "YYYY/MM/DD"
            )
            .locale("en")
            .format("YYYY/MM/DD")
            .replace("/", "-")
            .replace("/", "-");
        searchQuery = `date=${date}`;

        try {
            setLoading(true);
            const res = await fetch(
                `${BASE_URL}/admin/classroom/monitoring/done?${searchQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            const { data } = await res.json();
            setMonitoringList(data);
            setLoading(false);
        } catch (error) {
            console.log("Error reading monitoring list", error);
        }
    };

    return (
        <div>
            <Box title="مانیتورینگ انجام شده">
                <div className={styles["search"]}>
                    <form className={styles["search-wrapper"]}>
                        <div className={`${styles["search-row"]}`}>
                            <div
                                className={`input-wrapper ${styles["input-wrapper"]}`}
                            >
                                <label
                                    htmlFor="publish_time"
                                    className={`form__label ${styles["search-label"]}`}
                                >
                                    تاریخ‌ :
                                </label>
                                <div className="form-control">
                                    <DatePicker
                                        value={selectedDate}
                                        onChange={setSelectedDate}
                                        shouldHighlightWeekends
                                        locale="fa"
                                        wrapperClassName="date-input-wrapper"
                                        inputClassName="date-input"
                                        colorPrimary="#545cd8"
                                        inputPlaceholder="انتخاب کنید"
                                    />
                                </div>
                            </div>
                            <div className={styles["btn-wrapper"]}>
                                <button
                                    type="button"
                                    className={`btn primary ${styles["btn"]}`}
                                    disabled={loading}
                                    onClick={() => readMonitoring()}
                                >
                                    {loading ? "در حال جستجو ..." : "جستجو"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="table__wrapper">
                    <table className="table">
                        <thead className="table__head">
                            <tr>
                                <th className="table__head-item">زبان آموز</th>
                                <th className="table__head-item">
                                    موبایل زبان آموز
                                </th>
                                <th className="table__head-item">استاد</th>
                                <th className="table__head-item">
                                    موبایل استاد
                                </th>
                                <th className="table__head-item">ادمین</th>
                                <th className="table__head-item">پلتفرم</th>
                                <th className="table__head-item">زبان</th>
                                <th className="table__head-item">کورس</th>
                                <th className="table__head-item">قیمت</th>
                                <th className="table__head-item">مدت کلاس</th>
                                <th className="table__head-item">وضعیت</th>
                                <th className="table__head-item">
                                    وضعیت پرداخت
                                </th>
                                <th className="table__head-item">کلاس اول</th>
                                <th className="table__head-item">ساعت ها</th>
                                <th className="table__head-item">تاریخ</th>
                                <th className="table__head-item">اقدامات</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {monitoringList?.map((item) => (
                                <tr className="table__body-row" key={item?.id}>
                                    <td className="table__body-item">
                                        {item?.user_name}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.user_mobile || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.teacher_name}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.teacher_mobile || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.monitoring_follower_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.platform_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.language_name}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.course_name || "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.price
                                            ? `${Intl.NumberFormat().format(
                                                  item?.price
                                              )} تومان`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.class_time
                                            ? `${item?.class_time} دقیقه`
                                            : "-"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.status === 1
                                            ? "فعال"
                                            : "غیرفعال"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.pay === 1
                                            ? "پرداخت شده"
                                            : "پرداخت نشده"}
                                    </td>
                                    <td className="table__body-item">
                                        {item?.first_class === 1
                                            ? "است"
                                            : "نیست"}
                                    </td>
                                    <td className="table__body-item">
                                        {`${getTime(item.time)[0].startHour}:${
                                            getTime(item.time)[0].startMinute
                                        }`}
                                        &nbsp;تا &nbsp;
                                        {`${
                                            getTime(item.time)[
                                                getTime(item.time).length - 1
                                            ].startHour
                                        }:${
                                            getTime(item.time)[
                                                getTime(item.time).length - 1
                                            ].startMinute
                                        }`}
                                    </td>
                                    <td className="table__body-item">
                                        {moment(item?.date).format(
                                            "YYYY/MM/DD"
                                        )}
                                    </td>
                                    <td className="table__body-item">
                                        <Link
                                            href={`/tkpanel/multiSessionsList/logs/${item.id}`}
                                        >
                                            <a className={`action-btn warning`}>
                                                لاگ پیگیری
                                            </a>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {monitoringList.length === 0 && (
                                <tr className="table__body-row">
                                    <td
                                        className="table__body-item"
                                        colSpan={16}
                                    >
                                        آیتمی پیدا نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Box>
        </div>
    );
}

export default DoneMonitoring;
