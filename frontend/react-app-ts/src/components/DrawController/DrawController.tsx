import {CircleMarker, Polyline, useMapEvents} from "react-leaflet";
import {useGeoPoints} from "../../hooks/useGeoPoints";
import L from "leaflet";

export const DrawController = () => {
    const {points, addPoint} = useGeoPoints();

    const map = useMapEvents({
        click(e) {
            console.log(e);
            addPoint(e.latlng);
        },
    });

    const color = "red";

    return (
        <>
            {points.length > 0 && <CircleMarker center={points[0]} radius={2} color={color}/>}
            <Polyline positions={points} color={color} renderer={L.svg({padding: 100})}/>
            {points.length > 1 && <CircleMarker center={points[points.length - 1]} radius={2} color={color}/>}
        </>
    );
};
