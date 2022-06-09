import { useEffect, useRef, useState } from "react";
import styles from "./CategorySelect.module.css";
import { useGlobalContext } from "../../../../../../context";
import { BsPinAngleFill } from "react-icons/bs";
import { BsPin } from "react-icons/bs";

function CategorySelect(props) {
    const {
        list,
        displayKey,
        defaultText,
        selected,
        setSelected,
        noResText,
        stylesProps,
        showSearch = true,
        listSchema,
        background,
        disabled = false,
        onAdd,
        id,
        openBottom = true,
    } = props;
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredList, setFilteredList] = useState(list);
    const selectRef = useRef(null);
    const { useOutsideAlerter } = useGlobalContext();
    const [pins, setPins] = useState(Array(list?.length).fill(0));
    const [openTop, setOpenTop] = useState(!!openBottom);

    useEffect(() => {
        if (!openBottom) {
            let pos = selectRef.current?.getBoundingClientRect();
            setOpenTop(document.body.scrollHeight - pos?.bottom > 250);
        }
    }, []);

    useOutsideAlerter(selectRef, () => setOpen(false));

    const pinOnChange = (i) => {
        let temp = [...pins];
        temp[i] = temp[i] ? 0 : 1;
        setPins(temp);
    };

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
                            >
                                <button
                                    className={styles["pin-btn"]}
                                    onClick={() => pinOnChange(ind)}
                                    type="button"
                                    disabled={selected === item}
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
                                        onAdd(item?.id, pins[ind]);
                                        setSelected(item);
                                        setOpen(false);
                                    }}
                                    disabled={selected === item}
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

export default CategorySelect;
