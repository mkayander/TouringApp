import {CircleMarker, Polyline, useMapEvents} from "react-leaflet";
import {useGeoPoints} from "../../hooks/useGeoPoints";
import L from "leaflet";
import React, {useEffect} from "react";
import {Waypoint} from "../../api/models/Waypoint";

type DrawControllerProps = {
    enabled: boolean,
    waypoints: Waypoint[]
}

export const DrawController: React.FC<DrawControllerProps> = ({enabled, waypoints}) => {
    const {points, addPoint, setFromWaypoints} = useGeoPoints();

    const map = useMapEvents({
        click(e) {
            if (!enabled) return;

            console.log(e);
            addPoint(e.latlng);
        },
    });

    useEffect(() => {
        setFromWaypoints(waypoints);
        if (waypoints[0] !== undefined) {
            map.panTo(waypoints[0].latLng);
        }
    }, [waypoints]);

    console.log(waypoints, points);

    const color = "red";

    return (
        <>
            {points.length > 0 && <CircleMarker center={points[0]} radius={2} color={color}/>}
            <Polyline positions={points} color={color} renderer={L.svg({padding: 100})}/>
            {points.length > 1 && <CircleMarker center={points[points.length - 1]} radius={2} color={color}/>}
        </>
    );
};
