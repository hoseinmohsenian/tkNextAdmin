import styles from "./Toggle.module.css";

function Toggle({ value, onClick }) {
    return (
        <div
            className={`${styles.toggle} ${
                value ? styles["toggle--active"] : undefined
            }`}
            onClick={onClick}
        >
            <div className={styles.one}></div>
            <div className={styles.two}></div>
            <div className={styles.three}></div>
        </div>
    );
}

export default Toggle;
