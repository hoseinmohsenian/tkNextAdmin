import axios from "axios";
// import { getCookie } from "../context/index";
import { getCookie } from "cookies-next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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

API.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error?.response?.status === 400) {
            if (error?.response?.data?.error?.invalid_params) {
                console.log(
                    "error",
                    error?.response?.data?.error?.invalid_params[0].message
                );
            } else {
                console.log("عملیات ناموفق بود", "error");
            }
        } else if (error?.response?.status === 401) {
            if (window) {
                window.location.href = "/tkcp/login";
            }
        } else if (error?.response?.status === 403) {
            if (window) {
                window.location.href = "/notauthorized";
            }
        } else {
            if (!error.response) console.log("error", "error");
            if (error?.response?.status === 500)
                console.log("error 500", "error");
            if (error && error.response && error?.response?.data) {
                // console.log(error?.response?.data?.error, "error");
                console.log("error", error?.response?.data?.error);
            }
        }

        return Promise.reject(error);
    }
);

export default API;
