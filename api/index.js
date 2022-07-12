import axios from "axios";
import { BASE_URL } from "../constants/index";
// import { getCookie } from "../context/index";
import { getCookie } from "cookies-next";
import { setIsAllowed } from "../context/index";

const API = axios.create({ baseURL: BASE_URL });

API.interceptors.request.use((req) => {
    const headers = req.headers || {};

    headers["access-control-allow-origin"] = "*";
    headers["Content-type"] = "application/json";

    const token = getCookie("admin_token");
    if (token && !headers.Authorization) {
        headers.Authorization = `Bearer ${token}`;
    }
    req.headers = headers;
    return req;
});

API.interceptors.response.use(null, (error) => {
    console.log(error.response, "res");
    if (error?.response?.status === 400) {
        // console.log(error?.response);
        // console.log(error?.response.data.error);
        if (error?.response?.data?.error?.invalid_params) {
            console.log(
                error?.response?.data?.error?.invalid_params[0].message
            );
            console.log(
                error?.response?.data?.error?.invalid_params[0].message,
                "error"
            );
        } else {
            console.log("عملیات ناموفق بود", "error");
        }
    } else if (error?.response?.status === 401) {
        console.log("عملیات ناموفق بود", "error");
        if (window) {
            window.location.href = "/login";
        }
        // return {
        //   redirect: {
        //     destination: '/login',
        //     statusCode: 302
        //   }
        // };
    } else if (error?.response?.status === 403) {
        console.log("not authorized");
        setIsAllowed(false);
        // if (window) {
        //     window.location.href = "/notatuhroizedpage";
        // }

        // return {
        //   redirect: {
        //     destination: '/login',
        //     statusCode: 302
        //   }
        // };
    } else {
        // console.log("عملیات ناموفق بود", "error");
        console.log("عملیات ناموفق بود", "error");

        if (!error.response) console.log("error", "error");
        if (error?.response?.status === 500) console.log("error 500", "error");
        if (error && error.response && error?.response?.data) {
            // console.log(error?.response?.data?.error, "error");
            console.log("error", error?.response?.data?.error);
        }
    }

    return Promise.reject(error);
});

export default API;
