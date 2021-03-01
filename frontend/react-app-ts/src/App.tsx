import React, {useEffect, useState} from 'react';
import {Container} from 'react-bootstrap';
import {LatLng} from "leaflet";
import './App.css';
import {ToolButton} from "./components/ToggleButton/ToolButton";
import pen from "./images/ico/pen1.ico";
import {MapView} from "./components/MapView/MapView";
import {Sidebar} from "./components/Sidebar/Sidebar";
import {TourRoute, TourRouteResponse} from "./api/models/TourRoute";
import {NumberParam, useQueryParam} from "use-query-params";
import api from "./api/api";

function App() {
    const startPos = new LatLng(55.4331145, 37.5562910);
    const [drawMode, editDrawMode] = useState(false);
    const [routeId, setRouteId] = useQueryParam("routeId", NumberParam);
    const [selectedTour, setSelectedTour] = useState<TourRoute>();

    useEffect(() => {
        if (routeId === null || routeId === undefined) return;

        api.get<TourRouteResponse>(`routes/${routeId}/`)
            .then(value => {
                setSelectedTour(new TourRoute(value.data));
            });
    }, [routeId]);

    console.log(selectedTour);

    return (
        <>
            <Sidebar activeRouteId={routeId} setRouteId={setRouteId}/>
            <Container>
                <h1>React Typescript Leaflet TEST</h1>
                <h6>{selectedTour?.title}</h6>
                <ToolButton label={"Нанести маршрут"} iconUrl={pen} active={drawMode}
                            callback={() => editDrawMode(!drawMode)}/>

                <MapView startPosition={startPos} defaultZoom={13} drawEnabled={drawMode} route={selectedTour}/>
            </Container>
        </>
    );
}

export default App;
