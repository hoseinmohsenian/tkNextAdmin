import styles from "./Overview.module.css";
import Card from "./Card/Card";

function Overview() {
    let weekIncome = [],
        monthIncome = [];
    for (let i = 0; i < 10; i++) {
        weekIncome.push(1000000 + Math.floor(Math.random() * i) * 1000000);
        monthIncome.push(1000000 + Math.floor(Math.random() * i) * 1000000);
    }

    return (
        <div className={styles.overview}>
            <div className="row">
                <Card title="تعداد درخواست جدید" color="green" number={12} />
                <Card title="تعداد کلاس های امروز" color="yellow" number={5} />
                <Card
                    title="درآمد این هفته"
                    color="red"
                    number="12000000 تومان"
                    data={weekIncome}
                />
                <Card
                    title="درآمد این ماه"
                    color="blue"
                    number="9900000 تومان"
                    data={monthIncome}
                />
            </div>
        </div>
    );
}

export default Overview;
