import React from "react";
import {TourRouteHook} from "../../hooks/useTourRoute";
import {EditToolsHook} from "../../hooks/useEditTools";
import {Popup} from "react-leaflet";
import {LatLng} from "leaflet";
import {DraggableMarker} from "./DraggableMarker";

type DestinationsControllerProps = {
    routeHook: TourRouteHook
    toolsHook: EditToolsHook
}

export const DestinationsController: React.FC<DestinationsControllerProps> = ({toolsHook, routeHook}) => {

    return (
        <>
            {routeHook.activeRoute?.destinations.map(destination =>
                <DraggableMarker
                    key={destination.pk}
                    draggable={true}
                    position={new LatLng(destination.latitude, destination.longitude)}
                    onMarkerMoved={(event) => {
                        console.log("Marker was moved! : ", event, event.target.getLatLng());
                    }}
                >
                    <Popup>
                        <h5>{destination.title}</h5>
                        <p>{destination.description}</p>
                    </Popup>
                </DraggableMarker>)
            }
        </>
    );
};