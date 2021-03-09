import {useState} from "react";
import {Waypoint} from "../api/models/Waypoint";
import {LatLng} from "leaflet";


export const useWaypoints = () => {
    const [points, setPoints] = useState<Waypoint[]>([]);

    const addPoint = (point: Waypoint) => {
        setPoints([...points, point]);
    };

    const removeWaypoint = (point: Waypoint) => {
        const newList = points.filter(value => value !== point);
        setPoints(newList);
    };

    const getPoint = (index: number) => points.length > index ? points[index] : null;

    const lastPoint = () => points[points.length - 1];

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

    return {points, setPoints, addPoint, removeWaypoint, getPoint, lastPoint, addPos, insertPos, getLatLngList};
};

export type WaypointsHook = ReturnType<typeof useWaypoints>