import React from "react";
import {TourRouteHook} from "../../hooks/useTourRoute";
import {EditTool, EditToolsHook} from "../../hooks/useEditTools";
import {Popup} from "react-leaflet";
import {LatLng} from "leaflet";
import {DraggableMarker} from "./DraggableMarker";
import {DestinationsHook} from "../../hooks/useDestinations";

type DestinationsControllerProps = {
    routeHook: TourRouteHook
    toolsHook: EditToolsHook
    destinationsHook: DestinationsHook
}

export const DestinationsController: React.FC<DestinationsControllerProps> = ({
                                                                                  toolsHook,
                                                                                  routeHook,
                                                                                  destinationsHook
                                                                              }) => {

    return (
        <div>
            {routeHook.activeRoute?.destinations.map((destination, index) =>
                <DraggableMarker
                    key={destination.pk}
                    draggable={toolsHook.activeTool === EditTool.Drag}
                    position={new LatLng(destination.latitude, destination.longitude)}
                    onMarkerMoved={(event) => {
                        destinationsHook.updateLocation(index, event.target.getLatLng());
                    }}
                >
                    <Popup>
                        <h5>{destination.title}</h5>
                        <p>{destination.description}</p>
                    </Popup>
                </DraggableMarker>)
            }
        </div>
    );
};