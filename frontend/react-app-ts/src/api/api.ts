import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: `http://${window.location.hostname}:8000/api/`,
    responseType: "json"
});

api.interceptors.request.use((config) => {
    config.headers["X-CSRFToken"] = Cookies.get("csrftoken");
    // console.log("api.interceptors.request: ", config.headers);
    return config;
}, error => console.error(error));

export default api;