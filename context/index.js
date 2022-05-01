import React, { useState, useContext, useEffect } from "react";
import moment from "jalali-moment";

const AppContext = React.createContext("");

const AppProvider = ({ children }) => {
    const [footerHeight, setFooterHeight] = useState(0); // Footers Height

    const randomNum = () => {
        return Math.random() * 100000;
    };

    // For "key" prop in map()
    const generateKey = (pre) => {
        return `${pre}_${randomNum()}_${new Date().getTime()}`;
    };

    const setCookie = (cName, cValue, expDays) => {
        const d = new Date();
        d.setTime(d.getTime() * (expDays * 24 * 60 * 60 * 1000));
        let expires = `expires=${d.toUTCString()}`;
        document.cookie = `${cName}=${cValue};expires=${expires};path=/`;
    };

    const getCookie = (cName) => {
        let name = `${cName}=`;
        let decodedCookie = decodeURIComponent(document.cookie);
        let cArr = decodedCookie.split(";");
        for (let i = 0; i < cArr.length; i++) {
            let c = cArr[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    const deleteCookie = (cName) => {
        if (getCookie(cName) !== "") {
            document.cookie = `${cName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
    };

    const useOutsideAlerter = (ref, callback) => {
        useEffect(() => {
            function handleClickOutside(event) {
                // Clicked outside
                if (ref.current && !ref.current.contains(event.target)) {
                    callback();
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    };

    function useWindowSize() {
        const [windowSize, setWindowSize] = useState({
            width: undefined,
            height: undefined,
        });

        useEffect(() => {
            if (typeof window !== "undefined") {
                function handleResize() {
                    setWindowSize({
                        width: window.innerWidth,
                        height: window.innerHeight,
                    });
                }

                window.addEventListener("resize", handleResize);
                handleResize();
                return () => window.removeEventListener("resize", handleResize);
            }
        }, []);
        return windowSize;
    }

    // Constructing times array
    let times = [];
    moment.locale("fa", { useGregorianParser: true });
    const m = moment();
    m.set("hour", 24);
    m.set("minute", 0);
    for (let i = 1; i <= 48; i++) {
        let startHour = m.format("HH");
        let startMinute = m.format("mm");
        m.add(30, "minute");
        let endHour = m.format("HH");
        let endMinute = m.format("mm");
        let newItem = { key: i, startHour, startMinute, endHour, endMinute };
        times.push(newItem);
    }

    const getTime = (hourString) => {
        const hoursArr = hourString
            .substring(1, hourString.length - 1)
            .split(",");
        return hoursArr.map((hour) => times[Number(hour)]);
    };

    return (
        <AppContext.Provider
            value={{
                footerHeight,
                setFooterHeight,
                generateKey,
                randomNum,
                setCookie,
                getCookie,
                deleteCookie,
                useOutsideAlerter,
                useWindowSize,
                getTime,
                times,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

const useGlobalContext = () => {
    return useContext(AppContext);
};

export { AppContext, AppProvider, useGlobalContext };
