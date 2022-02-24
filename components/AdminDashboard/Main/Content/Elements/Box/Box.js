import styles from "./Box.module.css";
import Link from "next/link";

function Box({ title, children, buttonInfo }) {
    return (
        <div className={styles.box}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>

                {buttonInfo && (
                    <div className={styles["btn-wrapper"]}>
                        <Link href={buttonInfo.url}>
                            <a className={`${styles.btn} ${buttonInfo.color}`}>
                                {buttonInfo.name}
                            </a>
                        </Link>
                    </div>
                )}
            </div>

            {children}
        </div>
    );
}

export default Box;
