import React, {useMemo} from "react";
import {Marker, MarkerProps} from "react-leaflet";
import {DragEndEvent, LeafletEventHandlerFnMap} from "leaflet";

type DraggableMarkerProps = MarkerProps & {
    onMarkerMoved: (event: DragEndEvent) => void
}

export const DraggableMarker: React.FC<DraggableMarkerProps> = ({onMarkerMoved, draggable = true, ...rest}) => {
    const eventHandlers = useMemo<LeafletEventHandlerFnMap>(
        () => {
            return {
                dragend(event) {
                    onMarkerMoved(event);
                }
            };
        },
        []
    );

    return (
        <Marker eventHandlers={eventHandlers} draggable={draggable} {...rest}/>
    );
};