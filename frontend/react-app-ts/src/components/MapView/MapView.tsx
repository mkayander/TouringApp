import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {LocationMarker} from "../LocationMarker/LocationMarker";
import {DrawController} from "../DrawController/DrawController";
import React, {useEffect, useState} from "react";
import {LatLng, LeafletEventHandlerFnMap} from "leaflet";

import "./MapView.css";
import styled from "styled-components";
import {MapEventsController} from "../MapEventsController/MapEventsController";
import {TourRoute} from "../../api/models/TourRoute";


enum CursorMode {
    Default,
    Drawing,
    Dragging
}


type MapViewProps = {
    startPosition: LatLng,
    defaultZoom: number,
    drawEnabled: boolean,
    dragging?: boolean,
    route?: TourRoute
}


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


export const MapView: React.FC<MapViewProps> = ({startPosition, defaultZoom, drawEnabled, route}) => {
    const getCursorMode = (drawing: boolean = drawEnabled): CursorMode => {
        return drawing ? CursorMode.Drawing : CursorMode.Default;
    };

    const [cursorMode, editCursorMode] = useState<CursorMode>(CursorMode.Default);

    useEffect(() => editCursorMode(getCursorMode()), [drawEnabled]); //TODO: Inspect the cause of this EsLint warning

    const handlers: LeafletEventHandlerFnMap = {
        dragstart() {
            editCursorMode(CursorMode.Dragging);
        },
        dragend() {
            editCursorMode(getCursorMode());
        }
    };

    return (
        <Overlay mode={cursorMode}>
            <MapContainer className={"main-map"} center={startPosition} zoom={defaultZoom} scrollWheelZoom={true}>
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
                <DrawController enabled={drawEnabled} waypoints={route?.waypoints || []}/>

                <MapEventsController handlers={handlers}/>
            </MapContainer>
        </Overlay>
    );
};