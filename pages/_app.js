import { AppProvider } from "../context/index";
import "../styles/globals.css";
import "../styles/grid.css";
import "../styles/general.css";
import "../styles/table.css";
import "../styles/colors.css";
import "../styles/admin/form.css";
import NProgress from "nprogress";
import Router from "next/router";

Router.onRouteChangeStart = (url) => {
    NProgress.start();
};

Router.onRouteChangeComplete = () => NProgress.done();

Router.onRouteChangeError = () => NProgress.done();

function MyApp({ Component, pageProps }) {
    return (
        <AppProvider>
            <Component {...pageProps} />
        </AppProvider>
    );
}

export default MyApp;
