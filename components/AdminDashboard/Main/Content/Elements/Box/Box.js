import styles from "./Box.module.css";
import Link from "next/link";

function Box({ title, children, buttonInfo }) {
    return (
        <div className={styles.box}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>

                {buttonInfo && (
                    <div className={styles["btn-wrapper"]}>
                        {buttonInfo.url ? (
                            <Link href={buttonInfo.url}>
                                <a
                                    className={`${styles.btn} ${buttonInfo.color}`}
                                    target={!!buttonInfo.blank && "_blank"}
                                >
                                    {buttonInfo.name}
                                </a>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => buttonInfo.onClick()}
                                className={`${styles.btn} ${buttonInfo.color}`}
                            >
                                {buttonInfo.name}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {children}
        </div>
    );
}

export default Box;
