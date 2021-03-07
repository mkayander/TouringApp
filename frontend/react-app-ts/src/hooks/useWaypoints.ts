import {useState} from "react";
import {Waypoint} from "../api/models/Waypoint";
import {LatLng} from "leaflet";


export const useWaypoints = (startPoint?: Waypoint) => {
    const [points, setPoints] = useState<Waypoint[]>(startPoint ? [startPoint] : []);

    const addPoint = (point: Waypoint) => {
        setPoints([...points, point]);
    };

    const removePoint = (point: Waypoint) => {
        const newList = points.filter(value => value === point);
        setPoints(newList);
    };

    const getPoint = (index: number) => points.length > index ? points[index] : null;

    const lastPoint = () => points[points.length - 1];

    const addFromLatLng = (latLng: LatLng) => {
        setPoints([...points, Waypoint.fromLatLng(latLng)]);
    };

    const getLatLngList = () => {
        return points.map(value => value.latLng);
    };

    const setFromWaypoints = (waypoints: Waypoint[]) => {
        setPoints(waypoints);
    };

    return {points, addPoint, removePoint, getPoint, lastPoint, addFromLatLng, getLatLngList, setFromWaypoints};
};

export type GeoPointsHook = ReturnType<typeof useWaypoints>