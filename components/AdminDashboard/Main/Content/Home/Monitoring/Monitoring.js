import styles from "./Monitoring.module.css";

function Monitoring() {
    const headers = [
        "#",
        "نام زبان آموز",
        "شماره زبان آموز",
        "اعتبار زبان اموز",
        "نام استاد",
        "نحوه رزرو",
        "پلتفرم",
        "کلاس",
        "وضعیت درخواست",
        "وضعیت کلاس",
        "وضعیت پرداخت",
        "قیمت",
        "تاریخ کلاس",
        "آخرین پیگیری",
        "زمان کلاس",
        "جلسه",
        "توضیح",
    ];

    return (
        <div className={styles.monitoring}>
            <h3 className={styles.title}>مانیتورینگ</h3>

            <div className="table__wrapper">
                <table className="table">
                    <thead className="table__head">
                        <tr>
                            {headers?.map((item, ind) => (
                                <th className="table__head-item" key={ind}>
                                    {item}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="table__body">
                        <tr className="table__body-row">
                            <td className="table__body-item">1</td>
                            <td className="table__body-item">علی کریمی</td>
                            <td className="table__body-item">12345678</td>
                            <td className="table__body-item">100000</td>
                            <td className="table__body-item">کریم باقری</td>
                            <td className="table__body-item">آنلاین</td>
                            <td className="table__body-item">بیگ بلو باتن</td>
                            <td className="table__body-item">شنبه ها</td>
                            <td className="table__body-item">در دست بررسی</td>
                            <td className="table__body-item">برگزار نشده</td>
                            <td className="table__body-item">تسویه</td>
                            <td className="table__body-item">30000</td>
                            <td className="table__body-item">1400/11/12</td>
                            <td className="table__body-item">دیروز</td>
                            <td className="table__body-item">شنبه عصر</td>
                            <td className="table__body-item">5</td>
                            <td className="table__body-item">توضیحیاتی</td>
                        </tr>
                        <tr className="table__body-row">
                            <td className="table__body-item">2</td>
                            <td className="table__body-item">علی کریمی</td>
                            <td className="table__body-item">12345678</td>
                            <td className="table__body-item">100000</td>
                            <td className="table__body-item">کریم باقری</td>
                            <td className="table__body-item">آنلاین</td>
                            <td className="table__body-item">بیگ بلو باتن</td>
                            <td className="table__body-item">شنبه ها</td>
                            <td className="table__body-item">در دست بررسی</td>
                            <td className="table__body-item">برگزار نشده</td>
                            <td className="table__body-item">تسویه</td>
                            <td className="table__body-item">30000</td>
                            <td className="table__body-item">1400/11/12</td>
                            <td className="table__body-item">دیروز</td>
                            <td className="table__body-item">شنبه عصر</td>
                            <td className="table__body-item">5</td>
                            <td className="table__body-item">توضیحیاتی</td>
                        </tr>
                        <tr className="table__body-row">
                            <td className="table__body-item">3</td>
                            <td className="table__body-item">علی کریمی</td>
                            <td className="table__body-item">12345678</td>
                            <td className="table__body-item">100000</td>
                            <td className="table__body-item">کریم باقری</td>
                            <td className="table__body-item">آنلاین</td>
                            <td className="table__body-item">بیگ بلو باتن</td>
                            <td className="table__body-item">شنبه ها</td>
                            <td className="table__body-item">در دست بررسی</td>
                            <td className="table__body-item">برگزار نشده</td>
                            <td className="table__body-item">تسویه</td>
                            <td className="table__body-item">30000</td>
                            <td className="table__body-item">1400/11/12</td>
                            <td className="table__body-item">دیروز</td>
                            <td className="table__body-item">شنبه عصر</td>
                            <td className="table__body-item">5</td>
                            <td className="table__body-item">توضیحیاتی</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Monitoring;
