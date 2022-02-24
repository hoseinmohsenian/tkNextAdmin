import styles from "./CreateUser.module.css";

function CreateUser() {
    return (
        <div className={styles.user}>
            <h3 className={styles.title}>ایجاد ادمین</h3>

            <div className={styles["form__wrapper"]}></div>
        </div>
    );
}

export default CreateUser;
