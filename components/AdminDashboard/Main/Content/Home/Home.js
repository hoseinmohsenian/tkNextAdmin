import BreadCrumbs from "../Elements/Breadcrumbs/Breadcrumbs";
import Cards from "./Cards/Cards";
import styles from "./Home.module.css";
import Monitoring from "./Monitoring/Monitoring";
import Overview from "./Overview/Overview";

function Home() {
    return (
        <div className={styles.home}>
            <BreadCrumbs />
            <Cards />
            <Overview />
            <Monitoring />
        </div>
    );
}

export default Home;
