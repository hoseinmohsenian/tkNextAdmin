import Head from "next/head";

function Header({
    children,
    title,
    description,
    keywords,
    og_description,
    og_title,
}) {
    return (
        <Head>
            <title>{title}</title>
            <meta charSet="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:description" content={og_description} />
            <meta property="og:title" content={og_title} />
            <meta property="og:locale" content="fa_IR" />
            <meta property="og:site_name" content="تیکا" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://tikkaa.ir" />
            <link rel="shortcut icon" href="/icons/faviconLogo.ico" />
            <link rel="apple-touch-icon" href="/icons/faviconLogo.ico" />
            {children}
        </Head>
    );
}

export default Header;
