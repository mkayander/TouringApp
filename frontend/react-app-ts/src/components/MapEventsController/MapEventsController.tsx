import React from 'react';
import {LeafletEventHandlerFnMap} from "leaflet";
import {useMapEvents} from "react-leaflet";
import {WaypointsHook} from "../../hooks/useWaypoints";

type MapEventsControllerProps = {
    handlers: LeafletEventHandlerFnMap
    activeRouteId?: number | null
    waypointsHook: WaypointsHook
}

export const MapEventsController: React.FC<MapEventsControllerProps> = ({handlers}) => {
    useMapEvents(handlers);

    return null;
};