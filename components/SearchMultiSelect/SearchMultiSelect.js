import { useEffect, useRef, useState, memo } from "react";
import styles from "./SearchMultiSelect.module.css";
import { ImCross } from "react-icons/im";

function SearchMultiSelect(props) {
    const {
        list,
        displayKey,
        displayKeySecond,
        id,
        defaultText,
        selected,
        setSelected,
        noResText,
        onRemove,
        max,
        maxErrorMsg,
        showAlert,
        onAdd,
        disabled = false,
        fontSize = 14.4,
        background,
        displayPattern,
        stylesProps,
        openBottom = true,
    } = props;
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
        setFilteredList(
            list?.filter((item) => {
                if (item[displayKey]?.indexOf(search.trim()) > -1) {
                    return item;
                }
            })
        );
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

    const addNewItem = (newItem) => {
        let errorMessage = maxErrorMsg || `حداکثر ${max} مقدار قابل انتخاب است`;
        if (selected?.length <= max - 1) {
            setSelected((oldSelects) => [...oldSelects, newItem]);
            if (onAdd && id) {
                onAdd(newItem[id]);
            }
        } else {
            showAlert(true, "warning", errorMessage);
        }
    };

    const findItem = (target) => {
        return selected?.find((item) => item?.id === target?.id);
    };

    const removeItem = (target) => {
        let temp = selected?.filter((item) => item !== target);
        setSelected(() => temp);

        if (onRemove !== undefined) {
            onRemove(target.id);
        }
    };

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
            }`}
            style={stylesProps}
            ref={selectRef}
        >
            <div
                className={styles["search-select__selected"]}
                onClick={() => setOpen(!open)}
                style={{ background: background }}
            >
                <div
                    className={styles["search-select__selected-list"]}
                    style={{ fontSize: `${fontSize}px` }}
                >
                    {selected?.length === 0
                        ? defaultText
                        : selected?.map((item, ind) => (
                              <div
                                  className={
                                      styles["search-select__selected-item"]
                                  }
                                  key={ind}
                              >
                                  <span>
                                      {displayKeySecond !== undefined && (
                                          <>{item[displayKeySecond]} - </>
                                      )}
                                      <ShowItem item={item} />
                                  </span>
                                  <span
                                      className={
                                          styles[
                                              "search-select__selected-item-close"
                                          ]
                                      }
                                      onClick={() => {
                                          removeItem(item);
                                          setOpen(false);
                                      }}
                                  >
                                      <ImCross />
                                  </span>
                              </div>
                          ))}
                </div>
                <span className={styles["search-select__selected-icon"]}>
                    +
                </span>
            </div>
            <div
                className={`${styles["search-select__content"]} ${
                    openTop ? styles["bottom"] : styles["top"]
                }`}
            >
                {/* Search input */}
                <div className={styles["search-select__content-search"]}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
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
                                setSelected([]);
                                setOpen(false);
                            }}
                            style={{ fontSize: `${fontSize}px` }}
                        >
                            {defaultText}
                        </div>
                    )}
                    {filteredList?.map((item, ind) => {
                        return (
                            <button
                                className={`${
                                    styles["search-select__content-item"]
                                } ${
                                    findItem(item) !== undefined &&
                                    styles[
                                        "search-select__content-item--disabled"
                                    ]
                                }`}
                                key={ind}
                                onClick={() => {
                                    addNewItem(item);
                                    setOpen(false);
                                }}
                                disabled={findItem(item) !== undefined}
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                {displayKeySecond !== undefined && (
                                    <>{item[displayKeySecond]} - </>
                                )}
                                <ShowItem item={item} />
                            </button>
                        );
                    })}

                    {/* No result from search */}
                    {filteredList?.length === 0 && (
                        <div
                            className={`${styles["search-select__content-item"]} ${styles["search-select__content-item--disabled"]}`}
                            style={{ fontSize }}
                        >
                            {noResText}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(SearchMultiSelect);
