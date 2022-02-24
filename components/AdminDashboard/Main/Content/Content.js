import styles from "./Content.module.css";

function Content({ children, showSidebar }) {
    return (
        <div
            className={`${styles.content} ${
                showSidebar && styles["content--open-side"]
            }`}
        >
            {children}
        </div>
    );
}

export default Content;
