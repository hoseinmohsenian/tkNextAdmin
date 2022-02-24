import Layout from "../components/Layout/Layout";
import { useRouter } from "next/router";
import { AppProvider } from "../context/index";
import "../styles/globals.css";
import "../styles/grid.css";
import "../styles/general.css";
import "../styles/slick-carousel/slick.css";
import "../styles/slick-carousel/slick-theme.css";
import "../styles/table.css";
import "../styles/colors.css";
import "../styles/admin/form.css";

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const { asPath } = router;

    // No need for header and footer in these pages
    if (
        asPath === "/login" ||
        asPath === "/student/dashboard" ||
        asPath === "/student/profile" ||
        asPath === "/tutor/dashboard" ||
        asPath === "/tutor/profile" ||
        asPath.startsWith("/tkpanel") ||
        asPath === "/tkcp/login" ||
        asPath.startsWith("/content")
    ) {
        return (
            <AppProvider>
                <Component {...pageProps} />
            </AppProvider>
        );
    } else {
        return (
            <AppProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </AppProvider>
        );
    }
}

export default MyApp;
