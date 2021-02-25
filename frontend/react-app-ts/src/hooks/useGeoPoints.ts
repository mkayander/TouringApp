import {useState} from "react";
import {LatLng} from "leaflet";

export const useGeoPoints = (startPoint?: LatLng) => {
    const [points, editPoints] = useState<LatLng[]>(startPoint ? [startPoint] : []);

    const addPoint = (point: LatLng) => {
        editPoints([...points, point]);
    };

    const removePoint = (point: LatLng) => {
        const newList = points.filter(value => value === point);
        editPoints(newList);
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

    return {points, addPoint, removePoint, getPoint};
};