import { useEffect, useRef, useState } from "react";
import styles from "./FetchSearchSelect.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { useGlobalContext } from "../../../../../../context";

function FetchSearchSelect({
    list,
    setList,
    displayKey,
    id,
    placeholder,
    selected,
    setSelected,
    noResText,
    stylesProps,
    listSchema,
    background,
    disabled = false,
    displayPattern,
    fontSize = 19.2,
    onSearch,
    openBottom = false,
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const selectRef = useRef(null);
    const [openTop, setOpenTop] = useState(!!openBottom);
    const [isSearching, setIsSearching] = useState(false);
    const { useOutsideAlerter } = useGlobalContext();

    useEffect(() => {
        if (!openBottom) {
            let pos = selectRef.current?.getBoundingClientRect();
            setOpenTop(document.body.scrollHeight - pos?.bottom > 250);
        }
    }, []);

    useOutsideAlerter(selectRef, () => setOpen(false));

    // To Show items in the list and the selected one
    const ShowItem = ({ item }) => {
        if (!displayPattern) {
            return item[displayKey];
        } else {
            return constructDisplayPattern(item);
        }
    };

    const constructDisplayPattern = (item) => {
        return displayPattern?.map((patternItem) =>
            patternItem.member ? item[patternItem.key] : patternItem.key
        );
    };

    useEffect(() => {
        if (search) {
            onSearch(search);
        } else {
            setSelected(listSchema);
            setList([]);
        }
    }, [search]);

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
                <div className={styles["search-select__content-search"]}>
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={
                            !isSearching && selected[displayKey]
                                ? constructDisplayPattern(selected).join("")
                                : search
                        }
                        onChange={(e) => setSearch(e.target.value)}
                        onBlur={() => setIsSearching(false)}
                        onFocus={() => setIsSearching(true)}
                        disabled={disabled}
                    />
                </div>

                <span className={styles["search-select__selected-icon"]}>
                    <IoIosArrowDown />
                </span>
            </div>
            <div
                className={`${styles["search-select__content"]} ${
                    openTop ? styles["bottom"] : styles["top"]
                }`}
            >
                {/* List Items */}
                <div className={styles["search-select__content-list"]}>
                    {list?.map((item, ind) => {
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
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                <ShowItem item={item} />
                            </div>
                        );
                    })}

                    {/* No result from search */}
                    {list?.length === 0 && (
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

export default FetchSearchSelect;
