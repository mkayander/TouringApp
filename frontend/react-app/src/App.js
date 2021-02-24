import './App.css';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import {useState} from "react";
import {Container} from "react-bootstrap";
import LocationMarker from "./components/LocationMarker";
import {DrawController} from "./components/DrawController";


function App() {
    const [startPos, editStartPos] = useState([55.4331145, 37.5562910]);

    return (
        <div className="App">
            <div className="App-header">
                <Container>
                    <MapContainer center={startPos} zoom={13} scrollWheelZoom={true}
                                  style={{"height": "700px", "width": "100%"}}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={startPos}>
                            <Popup>
                                A pretty CSS3 popup. <br/> Easily customizable.
                            </Popup>
                        </Marker>
                        <LocationMarker/>
                        <DrawController/>
                    </MapContainer>
                </Container>
            </div>
        </div>
    );
}

export default App;
