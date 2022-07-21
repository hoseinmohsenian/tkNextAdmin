import { useEffect, useRef, useState, memo } from "react";
import styles from "./SearchSelect.module.css";
import { IoIosArrowDown } from "react-icons/io";

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
    displayPattern,
    fontSize = 14.4,
    openBottom = true,
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredList, setFilteredList] = useState(list);
    const selectRef = useRef(null);
    const [openTop, setOpenTop] = useState(!!openBottom);

    useEffect(() => {
        if (!openBottom) {
            let pos = selectRef.current?.getBoundingClientRect();
            setOpenTop(document.body.scrollHeight - pos?.bottom > 250);
        }
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

    // To Show items in the list and the selected one
    const ShowItem = ({ item }) => {
        if (!displayPattern) {
            return item[displayKey];
        } else {
            return displayPattern?.map((patternItem) =>
                patternItem.member ? item[patternItem.key] : patternItem.key
            );
        }
    };

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
                <span
                    className={styles["search-select__selected-label"]}
                    style={{ fontSize: `${fontSize}px` }}
                >
                    {selected[displayKey] === "" || list?.length === 0 ? (
                        defaultText
                    ) : (
                        <ShowItem item={selected} />
                    )}
                </span>
                <span className={styles["search-select__selected-icon"]}>
                    <IoIosArrowDown />
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
                            style={{ fontSize: `${fontSize}px` }}
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
                                    selected[id] === item[id] &&
                                    styles[
                                        "search-select__content-item--disabled"
                                    ]
                                }`}
                                key={ind}
                                onClick={() => {
                                    setSelected(item);
                                    setOpen(false);
                                }}
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                <ShowItem item={item} />
                            </div>
                        );
                    })}

                    {/* No result from search */}
                    {filteredList?.length === 0 && (
                        <div
                            className={`${styles["search-select__content-item"]} ${styles["search-select__content-item--disabled"]}`}
                            style={{ fontSize: `${fontSize}px` }}
                        >
                            {noResText}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(SearchSelect);
