import {NumberParam, useQueryParam} from "use-query-params";
import {useEffect, useState} from "react";
import {TourRoute} from "../api/models/TourRoute";
import {fetchRouteData, fetchRoutesList} from "../api/api";
import {toast} from "react-toastify";

export const useTourRoute = () => {
    const [routeId, setRouteId] = useQueryParam("routeId", NumberParam);
    const [activeRoute, setActiveRoute] = useState<TourRoute>();

    const [routesList, setRoutesList] = useState<TourRoute[]>([]);

    useEffect(() => {
        fetchRoutesList()
            .then(result => setRoutesList(result))
            .catch(reason => toast.error(`❌ Ошибка при загрузке списка туров! ${reason}`));
    }, []);

    useEffect(() => {
        if (routeId === null || routeId === undefined) return;

        fetchRouteData(routeId)
            .then(newRoute => {
                setActiveRoute(newRoute);
                // enqueueSnackbar(`Тур "${newRoute.title}" успешно загружен!`, {variant: "success"})
                toast.dark(`Загружен тур "${newRoute.title}"`, {autoClose: 2000});
            })
            .catch(reason => console.error(reason));
    }, [routeId]);

    return {routeId, setRouteId, activeRoute, setActiveRoute};
};

export type TourRouteHook = ReturnType<typeof useTourRoute>
