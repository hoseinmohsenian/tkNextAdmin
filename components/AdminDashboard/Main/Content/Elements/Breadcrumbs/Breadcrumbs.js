import styles from "./Breadcrumbs.module.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import React, { useEffect, useCallback } from "react";
import { AiOutlineLeft } from "react-icons/ai";

const _defaultGetTextGenerator = (param, query) => null;
const _defaultGetDefaultTextGenerator = (path) => path;

// Pulled out the path part breakdown because its
// going to be used by both `asPath` and `pathname`
const generatePathParts = (pathStr) => {
    const pathWithoutQuery = pathStr.split("?")[0];
    return pathWithoutQuery.split("/").filter((v) => v.length > 0);
};

// Assuming `fetchAPI` loads data from the API and this will use the
// parameter name to determine how to resolve the text. In the example,
// we fetch the post from the API and return it's `title` property
//   const getTextGenerator = React.useCallback((param, query) => {
//     return {
//       "post_id": () => await fetchAPI(`/posts/${query.post_id}/`).title,
//     }[param];
//   }, []);

const titleize = (subpath) => subpath;

export default function NextBreadcrumbs({
    getTextGenerator = _defaultGetTextGenerator,
    substituteObj = {},
}) {
    const router = useRouter();

    const getDefaultTextGenerator = useCallback((substituteObj, subpath) => {
        return substituteObj[subpath] || titleize(subpath);
    }, []);

    const breadcrumbs = React.useMemo(
        function generateBreadcrumbs() {
            const asPathNestedRoutes = generatePathParts(router.asPath);
            const pathnameNestedRoutes = generatePathParts(router.pathname);

            const crumblist = asPathNestedRoutes.map((subpath, idx) => {
                // Pull out and convert "[post_id]" into "post_id"
                const param = pathnameNestedRoutes[idx]
                    .replace("[", "")
                    .replace("]", "");

                const href =
                    "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
                return {
                    href,
                    textGenerator: getTextGenerator(param, router.query),
                    text: getDefaultTextGenerator(
                        { ...substituteObj, tkpanel: "پنل ادمین" },
                        subpath
                    ),
                };
            });

            return [{ href: "/", text: "خانه" }, ...crumblist];
        },
        [
            router.asPath,
            router.pathname,
            router.query,
            getTextGenerator,
            getDefaultTextGenerator,
        ]
    );

    return (
        <div className={styles.box}>
            <Breadcrumbs
                aria-label="breadcrumb"
                separator={<AiOutlineLeft size={14} />}
            >
                {breadcrumbs.map((crumb, idx) => (
                    <Crumb
                        {...crumb}
                        key={idx}
                        last={idx === breadcrumbs.length - 1}
                    />
                ))}
            </Breadcrumbs>
        </div>
    );
}

function Crumb({ text: defaultText, textGenerator, href, last = false }) {
    const [text, setText] = React.useState(defaultText);

    useEffect(async () => {
        if (!Boolean(textGenerator)) {
            return;
        }
        // Run the text generator and set the text again
        const finalText = await textGenerator();
        setText(finalText);
    }, [textGenerator]);

    if (last) {
        return <Typography color="text.primary">{text}</Typography>;
    }

    return (
        <Link underline="hover" color="inherit" href={href}>
            {text}
        </Link>
    );
}
