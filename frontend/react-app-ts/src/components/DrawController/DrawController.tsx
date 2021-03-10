import {CircleMarker, Polyline, useMapEvents} from "react-leaflet";
import {WaypointsHook} from "../../hooks/useWaypoints";
import L, {LatLng} from "leaflet";
import React, {useEffect, useState} from "react";
import {TourRouteHook} from "../../hooks/useTourRoute";
import {EditTool, EditToolsHook} from "../../hooks/useEditTools";
import {Waypoint} from "../../api/models/Waypoint";

type DrawControllerProps = {
    routeHook: TourRouteHook
    waypointsHook: WaypointsHook
    toolsHook: EditToolsHook
}

const getClosestWaypointIndex = (points: Waypoint[], target: LatLng): number => {
    return points
        .map(value => value.latLng.distanceTo(target))
        .reduce((iMax, val, i, arr) => val < arr[iMax] ? i : iMax, 0);
};

export const DrawController: React.FC<DrawControllerProps> = ({toolsHook, routeHook, waypointsHook}) => {
    const {points, setPoints, lastPoint, addPos, insertPos, removeWaypoint} = waypointsHook;
    const [hoverPoint, setHoverPoint] = useState<LatLng | null>(null);
    const [targetWaypointIndex, setTargetWaypointIndex] = useState<number | null>(null);
    const {activeTool} = toolsHook;

    useMapEvents({
        click(e) {
            switch (activeTool) {
                case EditTool.Draw:
                    addPos(e.latlng);
                    break;

                case EditTool.Insert:
                    if (targetWaypointIndex !== null) {
                        insertPos(e.latlng, targetWaypointIndex + 1);
                    }
                    break;

                case EditTool.Delete:
                    if (targetWaypointIndex !== null) {
                        removeWaypoint(points[targetWaypointIndex]);
                        setTargetWaypointIndex(null);
                    }
                    break;
            }
        },
        mousemove(e) {
            if (activeTool === null) return;

            setHoverPoint(e.latlng);

            if (activeTool === EditTool.Delete || activeTool === EditTool.Insert) {
                setTargetWaypointIndex(getClosestWaypointIndex(points, e.latlng));
            }
        },
        mouseout() {
            setHoverPoint(null);
            setTargetWaypointIndex(null);
        }
    });

    const waypoints = routeHook.activeRoute?.waypoints || [];

    useEffect(() => {
        if (waypoints.length === 0) return;

        setPoints(waypoints);
        // map.panTo(waypoints[0].latLng);

    }, [waypoints]);

    const color = "red";

    return (
        <div>
            {points.length > 0 ? (
                <>
                    <CircleMarker center={points[0].latLng} radius={2} color={color}/>

                    {hoverPoint && (
                        <>
                            {(activeTool === EditTool.Draw) &&
                            <Polyline positions={[lastPoint().latLng, hoverPoint]} color={color} opacity={0.5}/>}

                            {(activeTool === EditTool.Delete && targetWaypointIndex !== null && points[targetWaypointIndex]) &&
                            <CircleMarker center={points[targetWaypointIndex].latLng} radius={5} color={"orange"}
                                          opacity={0.75}/>}

                            {(activeTool === EditTool.Insert && targetWaypointIndex !== null) && (
                                <>
                                    <Polyline positions={[points[targetWaypointIndex].latLng, hoverPoint]} color={color}
                                              opacity={0.5}/>
                                    <Polyline
                                        positions={[hoverPoint, points[Math.min(targetWaypointIndex + 1, points.length - 1)].latLng]}
                                        color={color}
                                        opacity={0.5}/>
                                </>
                            )}
                        </>
                    )}
                </>
            ) : null}

            <Polyline positions={points.map(value => value.latLng)} color={color} renderer={L.svg({padding: 100})}/>

            {points.length > 1 && <CircleMarker center={lastPoint().latLng} radius={2} color={color}/>}
        </div>
    );
};
