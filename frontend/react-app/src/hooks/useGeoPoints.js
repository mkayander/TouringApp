import {useState} from "react";
import {getDistanceFromLatLonInKm} from "../maths/haversine";

export const useGeoPoints = (initialValue) => {
    const [points, editPoints] = useState([]);

    const addPoint = (point) => {
        editPoints([...points, point]);
    };

    const removePoint = (point) => {
        const newList = points.filter(value => value === point);
        editPoints(newList);
    };

    const getPoint = (index) => points.length > index ? points[index] : null;

    const getTotalDistance = () => {
        const distance = points.reduce((prev, current, i) => {
            if (i > 0) {
                console.log(points[i - 1], points[i]);
                return prev + getDistanceFromLatLonInKm(points[i - 1], points[i]);
            }
            return prev;
        }, 0.0);

        console.log(distance);
        return distance;
    };

    return {points, addPoint, removePoint, getPoint, getTotalDistance};
};