import { useEffect, useRef, useState, memo } from "react";
import styles from "./PhoneInput.module.css";
import { IoIosArrowDown } from "react-icons/io";

function PhoneInput({
    list,
    displayKey = "name_fa",
    id,
    searchPlaceholder = "جستجو کنید",
    selectedCountry,
    setSelectedCountry,
    noResText = "کشوری پیدا نشد",
    stylesProps,
    showSearch = true,
    background,
    disabled = false,
    displayPattern,
    fontSize = 14.4,
    openBottom = true,
    mobile,
    mobileOnChange,
    showSelectedPrecode = true,
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
        } else {
            setFilteredList(list);
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
            className={`${styles["phone-input"]} ${
                open && !disabled && styles["phone-input--open"]
            } `}
            style={stylesProps}
            ref={selectRef}
        >
            <div
                className={styles["phone-input__header"]}
                style={{ background: background }}
            >
                <div className={styles["phone-input__input-wrapper"]}>
                    <input
                        type="tel"
                        placeholder="09012345678"
                        className={`form__input ${styles["phone-input__input"]}`}
                        onChange={(e) => mobileOnChange(e.target.value)}
                        value={mobile || ""}
                        pattern={`${
                            selectedCountry.code === "98"
                                ? // "^(0\?9[0-9]{9,9}?)$"   THIS IS THE CORRECT REGEX IN CASE OF FUTURE UNWANTED CHANGES
                                  "^(0\?9[0-9]{9,9}?)$"
                                : ".*"
                        }`}
						title="لطفا به فرمت صحیح شماره همراه توجه کنید"
                        maxLength={11}
                        disabled={!!disabled}
                    />
                </div>
                {/* flag */}
                <div
                    className={styles["phone-input__flag-wrapper"]}
                    onClick={() => setOpen(!open)}
                >
                    <span className={styles["phone-input__icon"]}>
                        <IoIosArrowDown />
                    </span>
                    {showSelectedPrecode && (
                        <span className={styles["phone-input__precode"]}>
                            {selectedCountry.code
                                ? `+${selectedCountry.code}`
                                : "-"}
                        </span>
                    )}
                    <img
                        src={selectedCountry.flag}
                        alt={selectedCountry.name_fa}
                        className={styles["phone-input__content-flag"]}
                    />
                </div>
            </div>
            <div
                className={`${styles["phone-input__content"]} ${
                    openTop ? styles["bottom"] : styles["top"]
                }`}
            >
                {/* Search input */}
                {showSearch && (
                    <div className={styles["phone-input__content-search"]}>
                        <input
                            type="text"
                            placeholder={searchPlaceholder || "Search"}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                )}
                {/* List Items */}
                <div className={styles["phone-input__content-list"]}>
                    {filteredList?.map((item, ind) => {
                        return (
                            <div
                                className={`${
                                    styles["phone-input__content-item"]
                                } ${
                                    selectedCountry[id] === item[id] &&
                                    styles[
                                        "phone-input__content-item--disabled"
                                    ]
                                }`}
                                key={ind}
                                onClick={() => {
                                    setSelectedCountry(item);
                                    setOpen(false);
                                }}
                                style={{ fontSize: `${fontSize}px` }}
                            >
                                <div
                                    style={{
                                        marginLeft: 6,
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <span
                                        className={styles["phone-input__code"]}
                                    >
                                        +{item.code}
                                    </span>
                                    <ShowItem item={item} />
                                </div>
                                <img
                                    src={item.flag}
                                    alt={item.name_fa}
                                    className={
                                        styles["phone-input__content-flag"]
                                    }
                                />
                            </div>
                        );
                    })}

                    {/* No result from search */}
                    {filteredList?.length === 0 && (
                        <div
                            className={`${styles["phone-input__content-item"]} ${styles["phone-input__content-item--disabled"]}`}
                        >
                            {noResText}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(PhoneInput);
