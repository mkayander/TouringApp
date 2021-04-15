import {NumberParam, useQueryParam} from "use-query-params";
import {useEffect, useState} from "react";
import {TourRoute} from "../api/models/TourRoute";
import {
    createTourRoute,
    CreateTourRouteArgs,
    deleteTourRoute,
    fetchRouteData,
    fetchRoutesList,
    repostRouteData
} from "../api/api";
import {toast} from "react-toastify";
import {AxiosResponse} from "axios";
import {Destination} from "../api/models/Destination";
import {Waypoint} from "../api/models/Waypoint";

export const useTourRoute = (onRouteChanged?: (route: TourRoute | null) => void) => {
    const [routeId, setRouteId] = useQueryParam("routeId", NumberParam);
    const [activeRoute, setActiveRoute] = useState<TourRoute | null>(null);

    const [routesList, setRoutesList] = useState<TourRoute[]>([]);

    const refreshRoutesList = () => {
        fetchRoutesList()
            .then(result => setRoutesList(result))
            .catch(reason => toast.error(`❌ Ошибка при загрузке списка туров! ${reason}`));
    };

    const refreshFullActiveRoute = (): boolean => {
        if (routeId === null || routeId === undefined) {
            setActiveRoute(null);
            onRouteChanged?.call(this, null);
            return false;
        }

        fetchRouteData(routeId)
            .then(newRoute => {
                setActiveRoute(newRoute);
                onRouteChanged?.call(this, newRoute);
                toast.dark(`Загружен тур "${newRoute.title}"`, {autoClose: 2000});
            })
            .catch(reason => {
                setRouteId(null);
                toast.error(`❌ Ошибка при загрузке данных о туре! ${reason}`);
            });

        return true;
    };

    useEffect(() => {
        refreshRoutesList();
    }, []);

    useEffect(() => {
        refreshFullActiveRoute();
    }, [routeId]);

    const repostRoute = () => {
        if (activeRoute === null) return;

        return repostRouteData(activeRoute)
            .then(route => {
                setActiveRoute(route);
                toast.success(`✅ Тур "${route.title}" сохранён успешно!`);
            });
    };

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

    const deleteRoute = (route: TourRoute) => {
        return deleteTourRoute(route.pk)
            .then(() => {
                if (activeRoute === route) setActiveRoute(null);
                refreshRoutesList();
                toast.dark(`Тур ${route.title} успешно удалён!`);
            })
            .catch(response => {
                toast.error(`❌ Ошибка при удалении тура "${route.title}"! ${Object.entries(response.data).map(arr => arr[1])}`);
            });
    };

    const updateDestinations = (destinations: Destination[]) => {
        if (activeRoute === null) return;

        const newRoute = activeRoute.clone();
        newRoute.destinations = destinations;
        setActiveRoute(newRoute);
    };

    const updateWaypoints = (waypoints: Waypoint[]) => {
        if (activeRoute === null) return;

        const newRoute = activeRoute.clone();
        newRoute.waypoints = waypoints;
        setActiveRoute(newRoute);
    };

    return {
        routeId,
        setRouteId,
        activeRoute,
        routesList,

        repostRoute,
        createRoute,
        deleteRoute,
        updateDestinations,
        updateWaypoints
    };
};

export type TourRouteHook = ReturnType<typeof useTourRoute>
