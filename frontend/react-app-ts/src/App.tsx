import React, {useState} from 'react';
import {Container} from 'react-bootstrap';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import {LatLng} from "leaflet";
import './App.css';
import {LocationMarker} from './components/LocationMarker/LocationMarker';
import {DrawController} from "./components/DrawController/DrawController";

function App() {
    const [startPos, editStartPos] = useState(new LatLng(55.4331145, 37.5562910));
    const [defaultZoom, editDefaultZoom] = useState(13);

    return (
        <Container>
            <h1>React Typescript Leaflet TEST</h1>
            <MapContainer center={startPos} zoom={defaultZoom} scrollWheelZoom={true}
                          style={{height: "80vh", width: "100%", padding: "100, 100"}}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={startPos}>
                    <Popup>
                        Это стартовая точка данной карты <br/>
                        В данном случае, это "ИСТ РГУТиС".
                    </Popup>
                </Marker>
                <LocationMarker/>
                <DrawController/>
            </MapContainer>
        </Container>
    );
}

export default App;
