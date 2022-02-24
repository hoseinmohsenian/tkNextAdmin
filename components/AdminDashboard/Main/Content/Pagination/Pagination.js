import React from "react";
import PaginationItem from "./PaginationItem/PaginationItem";
import styles from "./Pagination.module.css";
import { useGlobalContext } from "../../../../../context";

const Pagination = ({ pagData, read }) => {
    const { generateKey } = useGlobalContext();

    const goNext = async () => {
        await read(pagData?.current_page + 1);
    };

    const goPrevious = async () => {
        await read(pagData?.current_page - 1);
    };

    return (
        <div className={styles.pagination}>
            <button
                className={`${styles.pagination__arrow} ${
                    pagData.current_page === 1
                        ? styles[`pagination__arrow--disabled`]
                        : undefined
                }`}
                onClick={goPrevious}
                disabled={pagData.current_page === 1}
            >
                قبلی
            </button>
            <div className="d-flex align-center">
                {pagData?.links
                    ?.slice(1, pagData?.links?.length - 1)
                    ?.map((pagItem, ind) => {
                        if (!pagItem?.url) {
                            return (
                                <div
                                    key={generateKey(ind)}
                                    className={styles.pagination__dots}
                                >
                                    ...
                                </div>
                            );
                        }

                        return (
                            <PaginationItem
                                onClick={() => read(pagItem?.label)}
                                number={pagItem?.label}
                                active={pagItem?.active}
                                url={pagItem?.url}
                                key={generateKey(ind)}
                            />
                        );
                    })}
            </div>
            <button
                className={`${styles.pagination__arrow} ${
                    pagData.current_page === pagData.last_page
                        ? styles[`pagination__arrow--disabled`]
                        : undefined
                }`}
                onClick={goNext}
                disabled={pagData.current_page === pagData.last_page}
            >
                بعدی
            </button>
        </div>
    );
};

export default Pagination;
