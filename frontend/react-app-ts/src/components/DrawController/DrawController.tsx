import {CircleMarker, Polyline, useMapEvents} from "react-leaflet";
import {GeoPointsHook} from "../../hooks/useWaypoints";
import L, {LatLng} from "leaflet";
import React, {useEffect, useState} from "react";
import {Waypoint} from "../../api/models/Waypoint";
import {TourRoute} from "../../api/models/TourRoute";

type DrawControllerProps = {
    enabled: boolean
    waypoints: Waypoint[]
    tour?: TourRoute
    routePoints: GeoPointsHook
}

export const DrawController: React.FC<DrawControllerProps> = ({enabled, waypoints, tour, routePoints}) => {
    const {points, lastPoint, getLatLngList, addFromLatLng, setFromWaypoints} = routePoints;
    const [hoverPoint, setHoverPoint] = useState<LatLng | null>();

    const map = useMapEvents({
        click(e) {
            if (!enabled) return;

            console.log(e);
            addFromLatLng(e.latlng);
        },
        mousemove(e) {
            if (!enabled) return;

            setHoverPoint(e.latlng);
        },
        mouseout(e) {
            setHoverPoint(null);
        }
    });

    useEffect(() => {
        if (waypoints.length === 0) return;

        setFromWaypoints(waypoints);
        map.panTo(waypoints[0].latLng);

    }, [waypoints]);

    const color = "red";

    return (
        <>
            {points.length > 0 ? (
                <>
                    <CircleMarker center={points[0].latLng} radius={2} color={color}/>
                    {hoverPoint &&
                    <Polyline positions={[lastPoint().latLng, hoverPoint]} color={color} opacity={0.5}/>}
                </>
            ) : null}
            {tour && <Polyline positions={getLatLngList()} color={color}
                               renderer={L.svg({padding: 100})}/>}
            {points.length > 1 && <CircleMarker center={lastPoint().latLng} radius={2} color={color}/>}
        </>
    );
};
