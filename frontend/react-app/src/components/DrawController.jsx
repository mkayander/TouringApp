import {Polyline, useMapEvents} from "react-leaflet";

export const DrawController = () => {

    const map = useMapEvents({
        click(e) {
            console.log(e);
        },
    });

    const increment = 0.001;


    return (
        <Polyline positions={path}>
        </Polyline>
    );
};
