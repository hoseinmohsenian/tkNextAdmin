import styles from "./Sidebar.module.css";
import MenuItem from "./MenuItem/MenuItem";
import sidebarData from "./sidebarData";
import { useState } from "react";
import { useRouter } from "next/router";

function Sidebar({ showSidebar }) {
    const [openItem, setOpenItem] = useState(-1);
    const router = useRouter();
    const { asPath } = router;

    // let res = -9;
    // for (let k = 0; k < sidebarData.length; k++) {
    //     let { subNav } = sidebarData[k];
    //     console.log(subNav);
    //     subNav.map((navItem, i) => {
    //         const { title, path, icon, subNav } = navItem;

    //         if (path === asPath) {
    //             // setOpenItem(k);
    //             res = k;
    //         }
    //     });
    // }
    // setOpenItem(res);

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

export default Sidebar;
