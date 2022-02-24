import Card from "./Card/Card";
import styles from "./Cards.module.css";

function Cards() {
    return (
        <div className={styles.cards}>
            <div className="row">
                <Card
                    title="ست کردن کلاس جدید"
                    link="/tkpanel/newTeacher/addStudent"
                />
                <Card
                    title="کلاس های امروز"
                    link="/tkpanel/class/requestDetails/today"
                />
                <Card
                    title="وضعیت درخواست جدید"
                    link="/tkpanel/teacher/request/lists"
                />
                <Card title="لیست زبان آموزان" link="/tkpanel/profiles" />
            </div>
        </div>
    );
}

export default Cards;
