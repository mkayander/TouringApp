import {useState} from "react";

export const useGeoPoints = (initialValue) => {
    const [points, editPoints] = useState([]);

    const addPoint = (point) => {
        editPoints([...points, point]);
    };
};