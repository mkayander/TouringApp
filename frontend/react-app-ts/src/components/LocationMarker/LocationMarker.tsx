import React, { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { LatLng } from "leaflet";

interface ILocMarkerProps {
  color?: string;
  callback?: () => void;
}

export const LocationMarker: React.FC<ILocMarkerProps> = ({
  color = "red",
  callback,
}) => {
  const [position, setPosition] = useState<LatLng>();
  useMapEvents({
    // click() {
    //     map.locate();
    // },
    locationfound(e) {
      setPosition(e.latlng);
    },
  });

  return position instanceof LatLng ? (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
};
