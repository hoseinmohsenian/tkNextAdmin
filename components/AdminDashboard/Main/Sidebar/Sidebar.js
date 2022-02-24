import styles from "./Sidebar.module.css";
import MenuItem from "./MenuItem/MenuItem";
import sidebarData from "./sidebarData";
import { useState } from "react";

function Sidebar({ showSidebar }) {
    const [openItem, setOpenItem] = useState(-1);

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
                />
            ))}
        </aside>
    );
}

export default Sidebar;
