import styles from "./MenuItem.module.css";
import Link from "next/link";
import { useGlobalContext } from "../../../../../context";
import { IoIosArrowDown } from "react-icons/io";

function MenuItem({ data, openItem, setOpenItem, ind, showSidebar, asPath }) {
    const { title, icon, subNav } = data;
    const { generateKey } = useGlobalContext();

    const openMenuHandler = () => {
        setOpenItem(() => (openItem === -1 || openItem !== ind ? ind : -1));
    };

    return (
        <div
            className={`${styles.group} ${
                openItem === ind && showSidebar
                    ? styles["group--active"]
                    : undefined
            } ${showSidebar ? styles["sidebar--show"] : undefined}`}
            onClick={openMenuHandler}
        >
            <div className={styles["group-header-wrapper"]}>
                <div className={styles["group-header"]}>
                    <span className={styles["group-icon"]}>{icon}</span>
                    <span className={styles["group-title"]}>{title}</span>
                </div>
                <span className={styles["group-arrow"]}>
                    <IoIosArrowDown />
                </span>
            </div>
            <ul className={styles["sublist"]}>
                {subNav.map((navItem, i) => {
                    const { title, path, icon, subNav } = navItem;

                    if (subNav) {
                        return (
                            <ul className={styles["subnav"]} key={i}>
                                <div className={styles.subnav__title}>
                                    <span>{icon}</span>
                                    <span>{title}</span>
                                </div>
                                {subNav.map((item) =>
                                    item.subNav ? (
                                        <li key={generateKey(item.title)}>
                                            <ul className={styles["subnav"]}>
                                                <div
                                                    className={
                                                        styles.subnav__title
                                                    }
                                                >
                                                    <span>{item.icon}</span>
                                                    <span>{item.title}</span>
                                                </div>
                                                <span>
                                                    {item?.subNav?.map((it) => (
                                                        <li
                                                            className={
                                                                styles[
                                                                    "subitem"
                                                                ]
                                                            }
                                                            key={generateKey(
                                                                it.title
                                                            )}
                                                        >
                                                            <Link
                                                                href={it.path}
                                                            >
                                                                <a
                                                                    className={`${
                                                                        styles[
                                                                            "subitem-link"
                                                                        ]
                                                                    } ${
                                                                        it.path ===
                                                                        asPath
                                                                            ? styles[
                                                                                  "subitem-link--active"
                                                                              ]
                                                                            : undefined
                                                                    }`}
                                                                >
                                                                    <span>
                                                                        {
                                                                            it.icon
                                                                        }
                                                                    </span>
                                                                    <span>
                                                                        {
                                                                            it.title
                                                                        }{" "}
                                                                    </span>
                                                                </a>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </span>
                                            </ul>
                                        </li>
                                    ) : (
                                        <li
                                            className={styles["subitem"]}
                                            key={generateKey(item.title)}
                                        >
                                            <Link href={item.path}>
                                                <a
                                                    className={`${
                                                        styles["subitem-link"]
                                                    } ${
                                                        item.path === asPath
                                                            ? styles[
                                                                  "subitem-link--active"
                                                              ]
                                                            : undefined
                                                    }`}
                                                >
                                                    <span>{item.icon}</span>
                                                    <span>{item.title}</span>
                                                </a>
                                            </Link>
                                        </li>
                                    )
                                )}
                            </ul>
                        );
                    }

                    return (
                        <li className={styles["subitem"]} key={i}>
                            <Link href={path}>
                                <a
                                    className={`${styles["subitem-link"]} ${
                                        path === asPath
                                            ? styles["subitem-link--active"]
                                            : undefined
                                    }`}
                                >
                                    <span>{icon}</span>
                                    <span>{title}</span>
                                </a>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default MenuItem;
