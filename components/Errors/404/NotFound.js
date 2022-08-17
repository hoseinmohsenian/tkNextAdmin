import styles from "./NotFound.module.css";
import Image from "next/image";
import Link from "next/link";

function NotFound() {
    return (
        <div className={styles["not-found"]}>
            <div className="container">
                <div className={styles.image}>
                    <Image
                        src="/images/404.png"
                        blurDataURL="/images/404.png"
                        width={600}
                        height={305}
                        placeholder="blur"
                        alt="این صفحه در تیکا پیدا نشد"
                    />
                </div>
                <h2 className={styles.title}>این صفحه پیدا نشد</h2>
                <div className={styles["link-wrapper"]}>
                    <Link href="/tkpanel">
                        <a className={styles.link}>
                            <Image
                                src="/icons/home.png"
                                width={25}
                                height={25}
                                alt="آموزش زبان آنلاین تیکا"
                            />
                            <span>صفحه اصلی</span>
                        </a>
                    </Link>
                    <Link href="/tkpanel/teachers">
                        <a className={styles.link}>
                            <Image
                                src="/icons/teachers.png"
                                width={25}
                                height={25}
                                alt="لیست اساتید آموزش زبان تیکا"
                            />
                            <span>لیست اساتید</span>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
