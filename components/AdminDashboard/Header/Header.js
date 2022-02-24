import { useState, useRef } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import Image from "next/image";
import DefaultImg from "../../../public/images/tikka-default.png";
import Toggle from "../../Toggle/Toggle";
import { useGlobalContext } from "../../../context";
import { IoIosArrowDown } from "react-icons/io";

function Header({ showSidebar, setShowSidebar }) {
    const [openDD, setOpenDD] = useState(false);
    const dropdownRef = useRef(null);
    const { useOutsideAlerter } = useGlobalContext();

    const dropdownHandler = () => {
        setOpenDD(!openDD);
    };

    const closeDDHandler = () => {
        setOpenDD(false);
    };

    useOutsideAlerter(dropdownRef, closeDDHandler);

    return (
        <header className={styles.header}>
            <div>
                <Toggle
                    value={showSidebar}
                    onClick={() => setShowSidebar(!showSidebar)}
                />
            </div>

            <div className={styles.left}>
                <Link href="/find-teachers">
                    <a className={styles["list-btn"]}>لیست مدرسین</a>
                </Link>

                <div
                    className={styles.user}
                    onClick={dropdownHandler}
                    ref={dropdownRef}
                >
                    <span
                        className={`${styles["user-arrow"]} ${
                            openDD ? styles["user-arrow--show"] : undefined
                        }`}
                    >
                        <IoIosArrowDown />
                    </span>
                    <div className={styles["img-wrapper"]}>
                        <Image src={DefaultImg} height={40} width={40} />
                    </div>
                    <span className={styles["user-name"]}>مهدی جلالی</span>

                    {/* Dropdown */}
                    <div
                        className={`${styles.dropdown} ${
                            openDD ? styles["dropdown--show"] : undefined
                        }`}
                    >
                        <div className={styles["dropdown__group"]}>
                            <span className={styles["dropdown__title"]}>
                                فعالیت ها
                            </span>
                            <Link href="/">
                                <a className={styles["dropdown__link"]}>
                                    <span>پیام ها</span>
                                    <span className={styles["dropdown__count"]}>
                                        12
                                    </span>
                                </a>
                            </Link>
                            <Link href="/">
                                <a className={styles["dropdown__link"]}>
                                    درخواست ها
                                </a>
                            </Link>
                        </div>

                        <div className={styles["dropdown__group"]}>
                            <span className={styles["dropdown__title"]}>
                                اکانت من
                            </span>
                            <Link href="/">
                                <a className={styles["dropdown__link"]}>
                                    تنظیمات
                                </a>
                            </Link>
                            <Link href="/">
                                <a className={styles["dropdown__link"]}>خروج</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
