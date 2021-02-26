import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {LocationMarker} from "../LocationMarker/LocationMarker";
import {DrawController} from "../DrawController/DrawController";
import React from "react";
import {LatLng} from "leaflet";

import "./MapView.css";
import styled from "styled-components";

type MapViewProps = {
    startPosition: LatLng,
    defaultZoom: number,
    drawEnabled: boolean,
    dragging?: boolean
}

type OverlayProps = {
    drawCursor: boolean
}

const Overlay = styled.div<OverlayProps>`
  & > div {
    ${({drawCursor}) => drawCursor ?
            "cursor: pointer !important" : "cursor: grab"
    }
  }
`;

export const MapView: React.FC<MapViewProps> = ({startPosition, defaultZoom, drawEnabled}) => {
    return (
        <Overlay drawCursor={drawEnabled}>
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
                <DrawController enabled={drawEnabled}/>
            </MapContainer>
        </Overlay>
    );
};