import styles from "./Main.module.css";
import Sidebar from "./Sidebar/Sidebar";
import Content from "./Content/Content";

function Main({ children, showSidebar, setShowSidebar }) {
    return (
        <div className={styles.main}>
            <Sidebar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
            />
            <Content showSidebar={showSidebar} setShowSidebar={setShowSidebar}>
                {children}
            </Content>
        </div>
    );
}

export default Main;
