import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../../../../../context";
import styles from "./CategoryMultiSelect.module.css";
import { BsPinAngleFill } from "react-icons/bs";
import { BsPin } from "react-icons/bs";

function CategoryMultiSelect(props) {
    const {
        list,
        displayKey,
        defaultText,
        selected,
        setSelected,
        noResText,
        width,
        onAdd,
        onRemove,
        max,
        showAlert,
        disabled = false,
        openBottom = true,
    } = props;
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredList, setFilteredList] = useState(list);
    const selectRef = useRef(null);
    const [openTop, setOpenTop] = useState(true);
    const { useOutsideAlerter } = useGlobalContext();
    const [pins, setPins] = useState(Array(list?.length).fill(0));

    useEffect(() => {
        if (!openBottom) {
            let pos = selectRef.current?.getBoundingClientRect();
            setOpenTop(document.body.scrollHeight - pos?.bottom > 250);
        }
    }, []);

    useOutsideAlerter(selectRef, () => setOpen(false));

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

    const addNewItem = (newItem, ind) => {
        let errorMessage = `حداکثر ${max} مقدار قابل انتخاب است`;
        if (selected?.length <= max - 1) {
            setSelected((oldSelects) => [...oldSelects, newItem]);
            onAdd(newItem?.id, pins[ind]);
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

    const pinOnChange = (i) => {
        let temp = [...pins];
        temp[i] = temp[i] ? 0 : 1;
        setPins(temp);
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
                                  <span>{item[displayKey]}</span>
                                  <span
                                      className={
                                          styles[
                                              "search-select__selected-item-close"
                                          ]
                                      }
                                      onClick={() => {
                                          if (!disabled) {
                                              removeItem(item);
                                              setOpen(false);
                                          }
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
                            <div
                                className={`${
                                    styles["search-select__content-item"]
                                } ${
                                    findItem(item) !== undefined &&
                                    styles[
                                        "search-select__content-item--disabled"
                                    ]
                                }`}
                                key={ind}
                            >
                                <button
                                    className={styles["pin-btn"]}
                                    onClick={() => pinOnChange(ind)}
                                    type="button"
                                    disabled={findItem(item) !== undefined}
                                >
                                    {pins[ind] ? (
                                        <>
                                            <BsPinAngleFill />
                                        </>
                                    ) : (
                                        <>
                                            <BsPin />
                                        </>
                                    )}
                                </button>
                                <button
                                    key={ind}
                                    onClick={() => {
                                        addNewItem(item, ind);
                                        setOpen(false);
                                    }}
                                    disabled={findItem(item) !== undefined}
                                    className={
                                        styles["search-select__content-text"]
                                    }
                                >
                                    {item[displayKey]}
                                </button>
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

export default CategoryMultiSelect;
