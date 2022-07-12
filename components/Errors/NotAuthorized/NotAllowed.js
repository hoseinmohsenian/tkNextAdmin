import styles from "./NotAuthorized.module.css";
import { AiOutlineStop } from "react-icons/ai";
import Link from "next/link";

function NotAuthorized() {
    return (
        <div className={styles["main"]}>
            <div className="container">
                <div className={styles.code_box}>
                    <span className={styles.icon}>
                        <AiOutlineStop />
                    </span>
                    <h1>403</h1>
                </div>
                <h2 className={styles.title}>شما به این صفحه دسترسی ندارید!</h2>
                <div className={styles["link-wrapper"]}>
                    <Link href={`/tkpanel`}>
                        <a className={`action-btn primary`}>صفحه اصلی</a>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotAuthorized;
