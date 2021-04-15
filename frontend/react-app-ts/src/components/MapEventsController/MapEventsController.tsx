import React, {useEffect} from 'react';
import {LatLng, LeafletEventHandlerFnMap} from "leaflet";
import {useMapEvents} from "react-leaflet";
import {WaypointsHook} from "../../hooks/useWaypoints";

type MapEventsControllerProps = {
    handlers: LeafletEventHandlerFnMap
    activeRouteId?: number | null
    waypointsHook: WaypointsHook
    panTarget?: LatLng
}

export const MapEventsController: React.FC<MapEventsControllerProps> = ({
                                                                            handlers,
                                                                            activeRouteId,
                                                                            waypointsHook,
                                                                            panTarget
                                                                        }) => {
    const map = useMapEvents(handlers);

    useEffect(() => {
        console.log("Selected tour route was changed.");

        const firstPoint = waypointsHook.state[0];
        if (firstPoint) {
            // map.panTo(firstPoint.latLng);
        }

    }, [activeRouteId]);

    useEffect(() => {
        panTarget && map.panTo(panTarget);
    }, [panTarget]);

    return null;
};