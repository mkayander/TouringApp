import {NumberParam, useQueryParam} from "use-query-params";
import {useEffect, useState} from "react";
import {TourRoute} from "../api/models/TourRoute";
import {createTourRoute, CreateTourRouteArgs, fetchRouteData, fetchRoutesList} from "../api/api";
import {toast} from "react-toastify";
import {AxiosResponse} from "axios";

export const useTourRoute = () => {
    const [routeId, setRouteId] = useQueryParam("routeId", NumberParam);
    const [activeRoute, setActiveRoute] = useState<TourRoute>();

    const [routesList, setRoutesList] = useState<TourRoute[]>([]);

    const refreshRoutesList = () => {
        fetchRoutesList()
            .then(result => setRoutesList(result))
            .catch(reason => toast.error(`❌ Ошибка при загрузке списка туров! ${reason}`));
    };

    useEffect(() => {
        refreshRoutesList();
    }, []);

    useEffect(() => {
        if (routeId === null || routeId === undefined) return;

        fetchRouteData(routeId)
            .then(newRoute => {
                setActiveRoute(newRoute);
                toast.dark(`Загружен тур "${newRoute.title}"`, {autoClose: 2000});
            })
            .catch(reason => toast.error(`❌ Ошибка при загрузке данных о туре! ${reason}`));
    }, [routeId]);

    const createRoute = (args: CreateTourRouteArgs) => {
        return createTourRoute(args)
            .then(createdRoute => {
                setActiveRoute(createdRoute);
                refreshRoutesList();
                toast.dark(`Тур "${createdRoute.title}" создан успешно!`);
            })
            .catch((response: AxiosResponse) => {
                console.log(response.data);
                toast.error(`❌ Ошибка при создании тура! ${Object.entries(response.data).map(arr => arr[1])}`);
                return Promise.reject(response);
            });
    };

    return {routeId, setRouteId, activeRoute, setActiveRoute, routesList, createRoute};
};

export type TourRouteHook = ReturnType<typeof useTourRoute>
