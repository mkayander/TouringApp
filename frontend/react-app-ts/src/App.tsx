import React, {useState} from 'react';
import {Container} from 'react-bootstrap';
import {LatLng} from "leaflet";
import './App.css';
import {ToolButton} from "./components/ToggleButton/ToolButton";
import pen from "./images/ico/pen1.ico";
import classNames from "classnames";
import {MapView} from "./components/MapView/MapView";

function App() {
    const [startPos, editStartPos] = useState(new LatLng(55.4331145, 37.5562910));
    const [defaultZoom, editDefaultZoom] = useState(13);

    const [drawMode, editDrawMode] = useState(false);

    const mapClasses = classNames({
        "main-map": true,
        "draw": drawMode
    });

    console.log(mapClasses);

    return (
        <Container>
            <h1>React Typescript Leaflet TEST</h1>
            <ToolButton label={"Нанести маршрут"} iconUrl={pen} active={drawMode}
                        callback={() => editDrawMode(!drawMode)}/>

            <MapView startPosition={startPos} defaultZoom={defaultZoom} drawEnabled={drawMode}/>
        </Container>
    );
}

export default App;
