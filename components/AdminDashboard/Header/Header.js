import { useState, useRef, useEffect, memo } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import Image from "next/image";
import DefaultImg from "../../../public/images/tikka-default.png";
import Logo from "../../../public/images/logopanel.png";
import Toggle from "../../Toggle/Toggle";
import { useGlobalContext } from "../../../context";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/router";

function Header({ showSidebar, setShowSidebar }) {
    const [openDD, setOpenDD] = useState(false);
    const [adminName, setAdminName] = useState("");
    const dropdownRef = useRef(null);
    const { useOutsideAlerter, getCookie, deleteCookie } = useGlobalContext();
    const router = useRouter();

    const dropdownHandler = () => {
        setOpenDD(!openDD);
    };

    const closeDDHandler = () => {
        setOpenDD(false);
    };

    useOutsideAlerter(dropdownRef, closeDDHandler);

    const logout = () => {
        deleteCookie("admin_name");
        deleteCookie("admin_token");
        router.push("/tkcp/login");
    };

    useEffect(() => {
        setAdminName(getCookie("admin_name"));
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.right}>
                <Toggle
                    value={showSidebar}
                    onClick={() => setShowSidebar(!showSidebar)}
                />

                <div className={styles["logo"]}>
                    <Link href="/">
                        <a style={{ display: "flex" }}>
                            <Image
                                src={Logo}

                                // height={40} width={40}
                            />
                        </a>
                    </Link>
                </div>
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
                    <span className={styles["user-name"]}>{adminName}</span>

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
                                        ۱۲
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
                            <button
                                type="button"
                                className={styles["dropdown__link"]}
                                onClick={logout}
                            >
                                خروج
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default memo(Header);
