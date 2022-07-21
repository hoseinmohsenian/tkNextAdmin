import styles from "./ImageCrop.module.css";

function ImageCrop({ children, show, setter, disabled, onClick }) {
    const closeModal = () => {
        setter(!show);
    };

    const handleClick = () => {
        onClick();
        closeModal();
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modal__overlay} onClick={closeModal}></div>

            <div className={styles.modal__wrapper}>
                <div className={styles.modal__header}>
                    <button
                        onClick={closeModal}
                        className={styles["modal__close-btn"]}
                    >
                        <img
                            src="/icons/remove.png"
                            className={styles["modal__close-img"]}
                            alt="بستن مودال"
                        />
                    </button>
                </div>

                <div className={styles.modal__body}>{children}</div>

                <div className={styles.modal__footer}>
                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={disabled}
                        className={`${styles["modal__fooer-btn"]} primary`}
                    >
                        برش
                    </button>
                    <button
                        type="button"
                        onClick={closeModal}
                        className={`${styles["modal__fooer-btn"]} ${styles["modal__fooer-btn--gray"]}`}
                    >
                        لغو
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageCrop;
