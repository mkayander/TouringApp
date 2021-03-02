import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {LocationMarker} from "../LocationMarker/LocationMarker";
import {DrawController} from "../DrawController/DrawController";
import React, {Dispatch, useEffect, useState} from "react";
import {LatLng, LeafletEventHandlerFnMap, Map as LeafletMap} from "leaflet";

import "./MapView.css";
import styled from "styled-components";
import {MapEventsController} from "../MapEventsController/MapEventsController";
import {TourRoute} from "../../api/models/TourRoute";


enum CursorMode {
    Default,
    Drawing,
    Dragging
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


type MapViewProps = {
    setMapInstance: Dispatch<LeafletMap>
    setUserPosition: Dispatch<LatLng>
    startPosition: LatLng
    defaultZoom: number
    drawEnabled: boolean
    dragging?: boolean
    route?: TourRoute
    setSelectedTour: Dispatch<TourRoute>
}

export const MapView: React.FC<MapViewProps> = ({
                                                    setMapInstance,
                                                    setUserPosition,
                                                    startPosition,
                                                    defaultZoom,
                                                    drawEnabled,
                                                    route,
                                                    setSelectedTour
                                                }) => {
    const getCursorMode = (drawing: boolean = drawEnabled): CursorMode => {
        return drawing ? CursorMode.Drawing : CursorMode.Default;
    };

    const [cursorMode, editCursorMode] = useState<CursorMode>(CursorMode.Default);

    useEffect(() => editCursorMode(getCursorMode()), [drawEnabled]);

    const handlers: LeafletEventHandlerFnMap = {
        dragstart() {
            editCursorMode(CursorMode.Dragging);
        },
        dragend() {
            editCursorMode(getCursorMode());
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
                <DrawController enabled={drawEnabled} route={route} setSelectedTour={setSelectedTour} waypoints={route?.waypoints || []}/>

                <MapEventsController handlers={handlers}/>
            </MapContainer>
        </Overlay>
    );
};