import {useEffect, useState} from "react";
import {Waypoint} from "../api/models/Waypoint";
import {LatLng} from "leaflet";
import {TourRouteHook} from "./useTourRoute";


export const useWaypoints = (routeHook: TourRouteHook) => {
    const [points, setPoints] = useState<Waypoint[]>([]);

    useEffect(() => {
        const newPoints = routeHook.activeRoute?.waypoints;
        if (newPoints != undefined) {
            setPoints(newPoints);
        }
    }, [routeHook.activeRoute?.waypoints]);

    const addPoint = (point: Waypoint) => {
        setPoints([...points, point]);
    };

    const removeWaypoint = (point: Waypoint) => {
        const newList = points.filter(value => value !== point);
        setPoints(newList);
    };

    const getPoint = (index: number) => points.length > index ? points[index] : null;

    const lastPoint = () => points[points.length - 1];

    const middlePoint = () => points[points.length / 2];

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

    return {
        points,
        setPoints,
        addPoint,
        removeWaypoint,
        getPoint,
        addPos,
        insertPos,
        getLatLngList,
        lastPoint,
        middlePoint,
    };
};

export type WaypointsHook = ReturnType<typeof useWaypoints>