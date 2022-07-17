import styles from "./GuideContent.module.css";

function GuideContent() {
    return (
        <div className={styles["guide-content"]}>
            <div className={`row ${styles["guide-content__header"]}}`}>
                <div
                    className={`col-md-6 ${styles["guide-content__header-item"]}`}
                >
                    <span className={styles["guide-content__header-icon"]}>
                        &#9432;
                    </span>
                    <h5 className={styles["guide-content__header-title"]}>
                        ابتدا راهنمای ضبط ویدئوی مناسب را مشاهده بفرمائید.
                    </h5>
                </div>

                <div className={`col-md-6 ${styles["guide-content__video"]}`}>
                    <iframe src="https://www.aparat.com/video/video/embed/videohash/6p0nR/vt/frame"></iframe>
                </div>
            </div>
            <div className={styles.line}></div>
            <div className={styles["guide-content__exp"]}>
                <p>لطفا برای آپلود ویدئوی مناسب قوانین ما را دنبال کنید</p>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <ul className={`${styles["list"]} ${styles["list--good"]}`}>
                        <li>
                            <span>&#x2611;</span>
                            <span className={styles["list-title"]}>
                                بهتر است
                            </span>
                        </li>
                        <li>
                            <span>&#x2611;</span>
                            <span className={styles["list-title"]}>
                                از کیفیت صدا و تصویر اطمینان حاصل کنید
                            </span>
                        </li>
                        <li>
                            <span>&#x2611;</span>
                            <span className={styles["list-title"]}>
                                در ویدئو از پس زمینه ساده استفاده کنید
                            </span>
                        </li>
                        <li>
                            <span>&#x2611;</span>
                            <span className={styles["list-title"]}>
                                فقط تصویر خودتان در ویدئو باشد
                            </span>
                        </li>
                        <li>
                            <span>&#x2611;</span>
                            <span className={styles["list-title"]}>
                                ویدئو نور مناسب داشته باشد
                            </span>
                        </li>
                        <li>
                            <span>&#x2611;</span>
                            <span className={styles["list-title"]}>
                                ویدئو را در حالت افقی ضبط کنید
                            </span>
                        </li>
                        <li>
                            <span>&#x2611;</span>
                            <span className={styles["list-title"]}>
                                خودتان را به زبانی که می خواهید آموزش دهید معرفی
                                کنید
                            </span>
                        </li>
                    </ul>
                </div>
                <div className="col-sm-6">
                    <ul className={`${styles["list"]} ${styles["list--bad"]}`}>
                        <li>
                            <span>&#x2611;</span>
                            <span className={styles["list-title"]}>
                                نبایدها
                            </span>
                        </li>
                        <li>
                            <span>&#x2611;</span>
                            <span className={styles["list-title"]}>
                                به صورت عمودی فیلم نگیرید
                            </span>
                        </li>
                        <li>
                            <span>&#x2611;</span>
                            <span className={styles["list-title"]}>
                                در ویدئو لوگو قرار دهید
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default GuideContent;
