import {CircleMarker, Polyline, useMapEvents} from "react-leaflet";
import {WaypointsHook} from "../../hooks/useWaypoints";
import L, {LatLng} from "leaflet";
import React, {useEffect, useState} from "react";
import {TourRouteHook} from "../../hooks/useTourRoute";

type DrawControllerProps = {
    enabled: boolean
    routeHook: TourRouteHook
    waypointsHook: WaypointsHook
}

export const DrawController: React.FC<DrawControllerProps> = ({enabled, routeHook, waypointsHook}) => {
    const {points, setPoints, lastPoint, getLatLngList, addFromLatLng} = waypointsHook;
    const [hoverPoint, setHoverPoint] = useState<LatLng | null>();

    useMapEvents({
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

    const waypoints = routeHook.activeRoute?.waypoints || [];

    useEffect(() => {
        if (waypoints.length === 0) return;

        setPoints(waypoints);
        // map.panTo(waypoints[0].latLng);

    }, [waypoints]);

    const color = "red";

    console.log("Active route", routeHook.activeRoute, "points: ", points);

    return (
        <>
            {points.length > 0 ? (
                <>
                    <CircleMarker center={points[0].latLng} radius={2} color={color}/>
                    {hoverPoint &&
                    <Polyline positions={[lastPoint().latLng, hoverPoint]} color={color} opacity={0.5}/>}
                </>
            ) : null}

            <Polyline positions={points.map(value => value.latLng)} color={color} renderer={L.svg({padding: 100})}/>

            {points.length > 1 && <CircleMarker center={lastPoint().latLng} radius={2} color={color}/>}
        </>
    );
};
