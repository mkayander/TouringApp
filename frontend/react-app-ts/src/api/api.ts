import axios from "axios";
import Cookies from "js-cookie";
import {TourRoute, TourRouteResponse} from "./models/TourRoute";

const getBaseUrl = () => process.env.REACT_APP_DEV_RUN ?
    `http://${window.location.hostname}:8000/api/` :
    `https://${window.location.hostname}/api/`;


const api = axios.create({
    baseURL: getBaseUrl(),
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

export type CreateTourRouteArgs = {
    title: String,
    description: String
}

export const createTourRoute = (
    args: CreateTourRouteArgs
): Promise<TourRoute> => new Promise((resolve, reject) => {
    api.post<TourRouteResponse>('routes/', args)
        .then(response => resolve(TourRoute.fromApiResponse(response.data)))
        .catch(reason => {
            reject(reason.response);
        });
});

export const deleteTourRoute = (id: Number): Promise<boolean> => new Promise((resolve, reject) => {
    api.delete(`routes/${id}/`)
        .then(response => {
            resolve(true);
            console.log(response);
        })
        .catch(reason => reject(reason.response));
});
