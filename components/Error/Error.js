import styles from "./Error.module.css";

function Error({ errorList }) {
    return (
        <div className={styles.error__box}>
            <ul>
                {errorList?.map((item, ind) => {
                    return <li key={ind}>{item}</li>;
                })}
            </ul>
        </div>
    );
}

export default Error;
