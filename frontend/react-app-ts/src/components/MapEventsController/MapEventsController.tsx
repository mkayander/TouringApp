import React, {useEffect} from 'react';
import {LeafletEventHandlerFnMap} from "leaflet";
import {useMapEvents} from "react-leaflet";
import {WaypointsHook} from "../../hooks/useWaypoints";

type MapEventsControllerProps = {
    handlers: LeafletEventHandlerFnMap
    activeRouteId?: number | null
    waypointsHook: WaypointsHook
}

export const MapEventsController: React.FC<MapEventsControllerProps> = ({
                                                                            handlers,
                                                                            activeRouteId,
                                                                            waypointsHook
                                                                        }) => {
    const map = useMapEvents(handlers);

    useEffect(() => {
        console.log("Selected tour route was changed.");

        const firstPoint = waypointsHook.points[0];
        if (firstPoint) {
            // map.panTo(firstPoint.latLng);
        }

    }, [activeRouteId]);

    return null;
};