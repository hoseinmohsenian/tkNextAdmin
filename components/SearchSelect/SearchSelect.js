import { useEffect, useRef, useState } from "react";
import styles from "./SearchSelect.module.css";

function SearchSelect({
    list,
    displayKey,
    id,
    defaultText,
    selected,
    setSelected,
    noResText,
    stylesProps,
    showSearch = true,
    listSchema,
    background,
    disabled = false,
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredList, setFilteredList] = useState(list);
    const selectRef = useRef(null);
    const [openTop, setOpenTop] = useState(true);

    useEffect(() => {
        let pos = selectRef.current?.getBoundingClientRect();
        setOpenTop(document.body.scrollHeight - pos?.bottom > 250);
    }, []);

    useOutsideAlerter(selectRef);

    // Update filtered list on search
    useEffect(() => {
        if (search) {
            setFilteredList(
                list?.filter((item) => {
                    if (item[displayKey].indexOf(search.trim()) > -1) {
                        return item;
                    }
                })
            );
        }
    }, [search]);

    useEffect(() => {
        setFilteredList(() => list);
    }, [list]);

    // Checks for click outside the select to close the select
    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                // Clicked outside
                if (ref.current && !ref.current.contains(event.target)) {
                    setOpen(false);
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    return (
        <div
            className={`${styles["search-select"]} ${
                open && !disabled && styles["search-select--open"]
            } `}
            style={stylesProps}
            ref={selectRef}
        >
            <div
                className={styles["search-select__selected"]}
                style={{ background: background }}
                onClick={() => setOpen(!open)}
            >
                <span className={styles["search-select__selected-label"]}>
                    {selected[displayKey] === "" || list?.length === 0
                        ? defaultText
                        : selected[displayKey]}
                </span>
                <span className={styles["search-select__selected-icon"]}>
                    v
                </span>
            </div>
            <div
                className={`${styles["search-select__content"]} ${
                    openTop ? styles["bottom"] : styles["top"]
                }`}
            >
                {/* Search input */}
                {showSearch && (
                    <div className={styles["search-select__content-search"]}>
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                )}
                {/* List Items */}
                <div className={styles["search-select__content-list"]}>
                    {filteredList?.length !== 0 && (
                        <div
                            className={`${
                                styles["search-select__content-item"]
                            } ${
                                selected === "" &&
                                styles["search-select__content-item--disabled"]
                            }`}
                            onClick={() => {
                                setSelected(listSchema);
                                setOpen(false);
                            }}
                        >
                            {defaultText}
                        </div>
                    )}
                    {filteredList?.map((item, ind) => {
                        return (
                            <div
                                className={`${
                                    styles["search-select__content-item"]
                                } ${
                                    selected === item &&
                                    styles[
                                        "search-select__content-item--disabled"
                                    ]
                                }`}
                                key={ind}
                                onClick={() => {
                                    setSelected(item);
                                    setOpen(false);
                                }}
                            >
                                {item[displayKey]}
                            </div>
                        );
                    })}

                    {/* No result from search */}
                    {filteredList?.length === 0 && (
                        <div
                            className={`${styles["search-select__content-item"]} ${styles["search-select__content-item--disabled"]}`}
                        >
                            {noResText}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchSelect;
