import styles from "./SuperSpinner.module.css";

function SuperSpinner({ color1, color2 }) {
    return (
        <div className={styles.container}>
            <div
                className={styles["super-spinner"]}
                style={{ borderTopColor: color1, borderBottomColor: color2 }}
            ></div>
        </div>
    );
}

export default SuperSpinner;
