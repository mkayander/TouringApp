import React from 'react';
import {LeafletEventHandlerFnMap} from "leaflet";
import {useMapEvents} from "react-leaflet";

type MapEventsControllerProps = {
    handlers: LeafletEventHandlerFnMap
}

export const MapEventsController: React.FC<MapEventsControllerProps> = ({handlers}) => {
    useMapEvents(handlers);

    return null;
};