import React, { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import Modal from "../Modal/Modal";
import HeaderModalContent from "./HeaderModalContent/HeaderModalContent";
import FixedButton from "./FixedButton/FixedButton";

function Header() {
    const [showModal, setShowModal] = useState(false);
    const header = useRef(null);
    const toggleBtn = useRef(null);
    const navCollapse = useRef(null);
    const dropdownBtn = useRef(null);
    const dropdown = useRef(null);
    const [languages, setLanguages] = useState([]);

    const fetchLanguages = async () => {
        try {
            const res = await fetch(
                "https://api.barmansms.ir/api/data/language",
                {
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                }
            );
            const { data } = await res.json();
            setLanguages(data);
        } catch (error) {
            console.log("error fetching languages", error);
        }
    };

    useEffect(() => {
        // Fixed Header
        window.addEventListener("scroll", () => {
            const scrollHeight = window.pageYOffset;
            if (scrollHeight > 50) {
                header.current?.classList?.add(styles["header--fixed"]);
            } else {
                header.current?.classList?.remove(styles["header--fixed"]);
            }
        });

        fetchLanguages();
    }, []);

    // Nav Toggle
    const handleNavToggle = () => {
        navCollapse.current.classList?.toggle(styles["nav__collapse--show"]);
    };

    // Nav Dropdown menu -- Languages
    const handleDropdown = () => {
        dropdown.current.classList?.toggle(styles["nav__dropdown--show"]);
    };

    return (
        <header className={styles.header} ref={header}>
            <div className="container">
                <nav className={styles.nav}>
                    <div className={styles["nav__small-row"]}>
                        {/* Logo is visible both on lg and sm screens */}
                        <a href="/">
                            <img
                                src="https://tikkaa.ir/img/index/header/tikkaLogo.png"
                                alt="یادگیری آنلاین زبان در خانه با پلتفرم برگزاری کلاس آنلاین  با هزینه کلاس زبان مناسب با تیکا"
                                className={styles.nav__img}
                                width={132}
                                height={52}
                            />
                        </a>
                        {/* Hidden in lg screens */}
                        <a
                            href="/find-teachers"
                            className={`${styles["nav__link-btn"]} gradient gradient--hoverable hidden-lg`}
                        >
                            لیست اساتید
                        </a>
                        {/* Hidden in lg screens */}
                        <button
                            className={`
                                ${styles["nav__toggle"]} hidden-lg
                            `}
                            onClick={handleNavToggle}
                            ref={toggleBtn}
                        >
                            toggle
                        </button>
                    </div>

                    {/* nav__collapse is visible both on lg and sm screens */}
                    <div className={styles.nav__collapse} ref={navCollapse}>
                        <ul className={styles.nav__list}>
                            <li className={styles.nav__item}>
                                <a href="/courses" className={styles.nav__link}>
                                    لیست دوره ها
                                </a>
                            </li>
                            <li className={styles.nav__item}>
                                <a
                                    href="/tutors/login"
                                    className={styles.nav__link}
                                >
                                    جذب استاد
                                </a>
                            </li>
                            <li className={styles.nav__item}>
                                <button
                                    className={`${styles.nav__link} ${styles["dropdown-btn"]}`}
                                    onClick={handleDropdown}
                                    ref={dropdownBtn}
                                >
                                    زبان ها
                                    <div
                                        className={styles["nav__link-arrow"]}
                                    ></div>
                                </button>
                                <div
                                    className={styles.nav__dropdown}
                                    ref={dropdown}
                                >
                                    <div className="row">
                                        {languages?.map((lan) => (
                                            <div
                                                className="col-xs-6"
                                                key={lan?.id}
                                            >
                                                <a
                                                    href={`/find-teachers/${lan?.english_name}`}
                                                    className={
                                                        styles[
                                                            "nav__dropdown-item"
                                                        ]
                                                    }
                                                >
                                                    <div
                                                        className={`${styles["nav__dropdown-item-flag"]} ${styles["nav__dropdown-item-flag--uk"]}`}
                                                    >
                                                        <img
                                                            src={`https:tikkaa.ir${lan?.flag_image}`}
                                                            alt={`${lan?.english_name} flag`}
                                                        />
                                                    </div>
                                                    <span>
                                                        زبان&nbsp;
                                                        {lan?.persian_name}
                                                    </span>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <div className={styles["nav__link-btns"]}>
                            <a
                                href="/find-teachers"
                                className={`${styles["nav__link-btn"]} gradient gradient--hoverable hidden-xs block-lg`}
                            >
                                لیست اساتید
                            </a>
                            <a
                                href="/login"
                                className={`${styles["nav__link-btn"]} ${styles["nav__link-btn--bordered"]}`}
                            >
                                <div
                                    className={styles["nav__link-btn--user"]}
                                ></div>
                                <span>نام کاربری شما</span>
                            </a>
                            <button
                                className={`${styles["nav__link-btn"]} ${styles["nav__link-btn--bordered"]} ${styles["nav__link-modal"]}`}
                                onClick={() => setShowModal(!showModal)}
                            >
                                <div
                                    className={styles["nav__phone-icon"]}
                                ></div>
                            </button>
                        </div>
                    </div>

                    {/* Nav Modal */}
                    <Modal
                        show={showModal}
                        setter={setShowModal}
                        padding={true}
                    >
                        <HeaderModalContent />
                    </Modal>
                </nav>
            </div>
            <FixedButton />
        </header>
    );
}

export default Header;
