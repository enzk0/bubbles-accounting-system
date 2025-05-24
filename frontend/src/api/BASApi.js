import axios from "axios";

const baseURL = "http://localhost:3000/api";

const publicApi = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

const privateApi = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

privateApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

privateApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");

            window.location.href = "/employee/login";
        }

        return Promise.reject(error);
    }
);

export { publicApi, privateApi };
