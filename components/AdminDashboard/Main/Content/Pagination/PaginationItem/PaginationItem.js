import styles from "./PaginationItem.module.css";

function PaginationItem({ number, active, onClick }) {
    return (
        <button
            onClick={() => onClick(number)}
            className={`${styles.paginationItem} ${
                active && styles["paginationItem--active"]
            }`}
        >
            {number}
        </button>
    );
}

export default PaginationItem;
