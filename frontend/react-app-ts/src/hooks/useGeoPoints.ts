import {useState} from "react";
import {LatLng} from "leaflet";
import {Waypoint} from "../api/models/Waypoint";


export const useGeoPoints = (startPoint?: LatLng) => {
    const [points, setPoints] = useState<LatLng[]>(startPoint ? [startPoint] : []);

    const addPoint = (point: LatLng) => {
        setPoints([...points, point]);
    };

    const removePoint = (point: LatLng) => {
        const newList = points.filter(value => value === point);
        setPoints(newList);
    };

    const setFromWaypoints = (waypoints: Waypoint[]) => {
        setPoints(waypoints.map(value => value.latLng));
    };

    const getPoint = (index: number) => points.length > index ? points[index] : null;

    // const getTotalDistance = () => {
    //     const distance = points.reduce((prev, current, i) => {
    //         if (i > 0) {
    //             console.log(points[i - 1], points[i]);
    //             return prev + getDistanceFromLatLonInKm(points[i - 1], points[i]);
    //         }
    //         return prev;
    //     }, 0.0);
    //
    //     console.log(distance);
    //     return distance;
    // };

    return {points, addPoint, removePoint, getPoint, setFromWaypoints};
};

export type GeoPointsHook = ReturnType<typeof useGeoPoints>