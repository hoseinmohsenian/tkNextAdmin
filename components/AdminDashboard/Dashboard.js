import { useState } from "react";
import styles from "./Dashboard.module.css";
import Header from "./Header/Header";
import Main from "./Main/Main";

function Dashboard({ children }) {
    const [showSidebar, setShowSidebar] = useState(true);

    return (
        <div>
            <style jsx global>
                {`
                    body {
                        background-color: #f1f4f6;
                    }
                `}
            </style>
            <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
            <Main showSidebar={showSidebar} setShowSidebar={setShowSidebar}>
                {children}
            </Main>
        </div>
    );
}

export default Dashboard;
