import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {LocationMarker} from "../LocationMarker/LocationMarker";
import {DrawController} from "../DrawController/DrawController";
import React, {Dispatch, useEffect, useState} from "react";
import {LatLng, LeafletEventHandlerFnMap, Map as LeafletMap} from "leaflet";

import "./MapView.css";
import styled from "styled-components";
import {MapEventsController} from "../MapEventsController/MapEventsController";
import {WaypointsHook} from "../../hooks/useWaypoints";
import {TourRouteHook} from "../../hooks/useTourRoute";
import {EditTool, EditToolsHook} from "../../hooks/useEditTools";


enum CursorMode {
    Default,
    Drawing,
    Dragging
}


const getCursorMode = (toolsHook: EditToolsHook): CursorMode => {
    switch (toolsHook.activeTool) {
        case EditTool.Draw:
            return CursorMode.Drawing;

        default:
            return CursorMode.Default;
    }
};


type OverlayProps = {
    mode: CursorMode
}


const Overlay = styled.div<OverlayProps>`
  & > div {
    ${({mode}) => {
      switch (mode) {
        case CursorMode.Drawing:
          return "cursor: pointer !important";

        case CursorMode.Dragging:
          return "cursor: grabbing !important";

        default:
          return "";
      }
    }}`;


type MapViewProps = {
    setMapInstance: Dispatch<LeafletMap>
    setUserPosition: Dispatch<LatLng>
    startPosition: LatLng
    defaultZoom: number
    toolsHook: EditToolsHook
    dragging?: boolean
    routeHook: TourRouteHook
    waypointsHook: WaypointsHook
}

export const MapView: React.FC<MapViewProps> = ({
                                                    setMapInstance,
                                                    setUserPosition,
                                                    startPosition,
                                                    defaultZoom,
                                                    toolsHook,
                                                    routeHook,
                                                    waypointsHook
                                                }) => {

    const [cursorMode, setCursorMode] = useState<CursorMode>(CursorMode.Default);

    useEffect(() => setCursorMode(getCursorMode(toolsHook)), [toolsHook.activeTool]);

    const handlers: LeafletEventHandlerFnMap = {
        dragstart() {
            setCursorMode(CursorMode.Dragging);
        },
        dragend() {
            setCursorMode(getCursorMode(toolsHook));
        },
        locationfound(e) {
            setUserPosition(e.latlng);
            console.log(e);
        },
        locationerror(e) {
            console.error(e);
        }
    };

    return (
        <Overlay mode={cursorMode}>
            <MapContainer whenCreated={map => {
                setMapInstance(map);
                map.locate();
            }} className={"main-map"} center={startPosition} zoom={defaultZoom} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={startPosition}>
                    <Popup>
                        Это стартовая точка данной карты <br/>
                        В данном случае, это "ИСТ РГУТиС".
                    </Popup>
                </Marker>
                <LocationMarker/>
                <DrawController enabled={toolsHook.activeTool === EditTool.Draw} routeHook={routeHook}
                                waypointsHook={waypointsHook}/>

                <MapEventsController handlers={handlers} activeRouteId={routeHook.routeId}
                                     waypointsHook={waypointsHook}/>
            </MapContainer>
        </Overlay>
    );
};