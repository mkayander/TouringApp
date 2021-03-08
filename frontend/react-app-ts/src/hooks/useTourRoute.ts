import {NumberParam, useQueryParam} from "use-query-params";
import {useState} from "react";
import {TourRoute} from "../api/models/TourRoute";

export const useTourRoute = () => {
    const [routeId, setRouteId] = useQueryParam("routeId", NumberParam);
    const [activeRoute, setActiveRoute] = useState<TourRoute>();

    return {routeId, setRouteId, activeRoute, setActiveRoute};
};

export type TourRouteHook = ReturnType<typeof useTourRoute>