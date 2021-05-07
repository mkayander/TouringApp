import {Waypoint} from "../api/models/Waypoint";
import {LatLng} from "leaflet";
import {TourRouteHook} from "./useTourRoute";
import {ArrayHook, useGenericArrayHook} from "./generics/useGenericArrayHook";
import {useEffect} from "react";
import {TourRoute} from "../api/models/TourRoute";

export interface WaypointsHook extends ArrayHook<Waypoint> {
    addPos(latLng: LatLng): void

    insertPos(latLng: LatLng, index: number): void

    getLatLngList(): LatLng[]

    apply(): TourRoute | undefined
}

export const useWaypoints = (routeHook: TourRouteHook): WaypointsHook => {
    const arrayHook = useGenericArrayHook<Waypoint>([]);
    const {state: points, setState: setPoints} = arrayHook;

    // const [state, setPoints] = useState<Waypoint[]>([]);

    useEffect(() => {
        const newPoints = routeHook.activeRoute?.waypoints;
        if (newPoints !== undefined) {
            setPoints(newPoints);
        }
    }, [routeHook.activeRoute?.waypoints]);

    const addPos = (latLng: LatLng) => {
        setPoints([...points, Waypoint.fromLatLng(latLng)]);
    };

    const insertPos = (latLng: LatLng, index: number) => {
        const newArray = [...points];
        newArray.splice(index, 0, Waypoint.fromLatLng(latLng));
        setPoints(newArray);
    };

    const getLatLngList = () => {
        return points.map(value => value.latLng);
    };

    const apply = (): TourRoute | undefined => {
        const routeId = routeHook.activeRoute?.pk;

        const peparedPoints = points.map((point, index) => {
                point.index = index;
                point.route = routeId;
                return point;
            })

        return routeHook.updateWaypoints(peparedPoints);
    };

    return {
        addPos,
        insertPos,
        getLatLngList,
        apply,
        ...arrayHook
    }
};