import styles from "./Card.module.css";
import Link from "next/link";

function Card({ title, link }) {
    return (
        <div className={`col-sm-6 col-lg-3 ${styles.card}`}>
            <Link href={link}>
                <a className={styles.card__link}>{title}</a>
            </Link>
        </div>
    );
}

export default Card;
