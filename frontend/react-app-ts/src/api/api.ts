import axios from "axios";
import Cookies from "js-cookie";
import {TourRoute, TourRouteResponse} from "./models/TourRoute";

const api = axios.create({
    baseURL: `https://${window.location.hostname}/api/`,
    responseType: "json"
});

api.interceptors.request.use((config) => {
    config.headers["X-CSRFToken"] = Cookies.get("csrftoken");
    // console.log("api.interceptors.request: ", config.headers);
    return config;
}, error => console.error(error));

export default api;

export const fetchRoutesList = (): Promise<TourRoute[]> => new Promise<TourRoute[]>((resolve, reject) => {
    api.get<TourRouteResponse[]>("routes/")
        .then(value => {
            const result = value.data.map(value => {
                return TourRoute.fromApiResponse(value);
            });
            resolve(result);
        })
        .catch(reason => reject(reason));
});

export const fetchRouteData = (pk: number): Promise<TourRoute> => new Promise<TourRoute>((resolve, reject) => {
    api.get<TourRouteResponse>(`routes/${pk}/`)
        .then(response => {
            resolve(TourRoute.fromApiResponse(response.data));
        })
        .catch(reason => reject(reason));
});

export const repostRouteData = (route: TourRoute): Promise<TourRoute> => new Promise<TourRoute>((resolve, reject) => {
    api.post<TourRouteResponse>(`routes/repost/${route.pk}/`, route.packData())
        .then(response => resolve(TourRoute.fromApiResponse(response.data)))
        .catch(reason => reject(reason));
});
