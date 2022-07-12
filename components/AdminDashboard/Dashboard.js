import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context";
import Header from "./Header/Header";
import Main from "./Main/Main";

function Dashboard({ children }) {
    const { useWindowSize } = useGlobalContext();
    const screenWidth = useWindowSize().width;
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        if (screenWidth) {
            setShowSidebar(screenWidth >= 768 ? true : false);
        }
    }, [screenWidth]);

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
