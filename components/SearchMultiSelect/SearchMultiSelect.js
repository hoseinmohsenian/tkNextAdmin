import { useEffect, useRef, useState } from "react";
import styles from "./SearchMultiSelect.module.css";

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
        width,
        onRemove,
        min,
        max,
        showAlert,
        onAdd,
        disabled = false,
    } = props;
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
        let errorMessage = `حداکثر ${max} مقدار قابل انتخاب است`;
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

    return (
        <div
            className={`${styles["search-select"]} ${
                open && !disabled && styles["search-select--open"]
            }`}
            style={{ width: `${width}` }}
            ref={selectRef}
        >
            <div
                className={styles["search-select__selected"]}
                onClick={() => setOpen(!open)}
            >
                <div className={styles["search-select__selected-list"]}>
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
                                      {item[displayKey]}
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
                                      X
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
                            >
                                {displayKeySecond !== undefined && (
                                    <>{item[displayKeySecond]} - </>
                                )}
                                {item[displayKey]}
                            </button>
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

export default SearchMultiSelect;
