import styles from "./Steps.module.css";

function Steps({ step, setStep }) {
    return (
        <ul className={styles.steps}>
            <li
                className={`${styles.step} ${
                    step === 1 && styles["step--active"]
                }`}
            >
                <button type="button" onClick={() => setStep(1)}>
                    اطلاعات عمومی
                </button>
            </li>
            <li
                className={`${styles.step} ${
                    step === 2 && styles["step--active"]
                }`}
            >
                <button type="button" onClick={() => setStep(2)}>
                    عکس پروفایل
                </button>
            </li>
            <li
                className={`${styles.step} ${
                    step === 3 && styles["step--active"]
                }`}
            >
                <button type="button" onClick={() => setStep(3)}>
                    توضیحات پروفایل
                </button>
            </li>
            <li
                className={`${styles.step} ${
                    step === 4 && styles["step--active"]
                }`}
            >
                <button type="button" onClick={() => setStep(4)}>
                    زبان مورد تدریس
                </button>
            </li>
            <li
                className={`${styles.step} ${
                    step === 5 && styles["step--active"]
                }`}
            >
                <button type="button" onClick={() => setStep(5)}>
                    هزینه کلاس
                </button>
            </li>
            <li
                className={`${styles.step} ${
                    step === 6 && styles["step--active"]
                }`}
            >
                <button type="button" onClick={() => setStep(6)}>
                    مدارک
                </button>
            </li>
            <li
                className={`${styles.step} ${
                    step === 7 && styles["step--active"]
                }`}
            >
                <button type="button" onClick={() => setStep(7)}>
                    ویدئو معرفی
                </button>
            </li>
        </ul>
    );
}

export default Steps;
