import { memo } from "react";
import styles from "./Sidebar.module.css";
import MenuItem from "./MenuItem/MenuItem";
import sidebarData from "./sidebarData";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

function Sidebar({ showSidebar }) {
    const [openItem, setOpenItem] = useState(-1);
    const router = useRouter();
    const { asPath } = router;

    const handleOpenSidebar = useCallback(() => {
        sidebarData.map((data, ind) => {
            const { subNav } = data;

            subNav.map((navItem, i) => {
                const { path, subNav } = navItem;

                if (path === asPath) {
                    setOpenItem(ind);
                }

                if (subNav) {
                    subNav.map((item, ind1) => {
                        if (item.path === asPath) {
                            // setOpenItem(ind1);
                            setOpenItem(ind);
                        }

                        if (item.subNav) {
                            item.subNav?.map((it, ind2) => {
                                if (it.path === asPath) {
                                    setOpenItem(ind);
                                }

                                if (it.subNav) {
                                    it.subNav?.subNav.map((innerItem) => {
                                        if (innerItem.path === asPath) {
                                            setOpenItem(ind);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    }, []);

    useEffect(() => {
        handleOpenSidebar();
    }, []);

    return (
        <aside
            className={`${styles.sidebar} ${
                showSidebar ? styles["sidebar--show"] : undefined
            }`}
        >
            {sidebarData.map((item, ind) => (
                <MenuItem
                    data={item}
                    key={ind}
                    openItem={openItem}
                    setOpenItem={setOpenItem}
                    ind={ind}
                    showSidebar={showSidebar}
                    asPath={asPath}
                />
            ))}
        </aside>
    );
}

export default memo(Sidebar);
