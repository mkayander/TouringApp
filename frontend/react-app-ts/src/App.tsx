import React, {useEffect, useState} from 'react';
import {Container} from 'react-bootstrap';
import {LatLng, Map as LeafletMap} from "leaflet";
import './App.css';
import {ToolButton} from "./components/ToggleButton/ToolButton";
import {MapView} from "./components/MapView/MapView";
import {Sidebar} from "./components/Sidebar/Sidebar";
import {TourRoute, TourRouteResponse} from "./api/models/TourRoute";
import {NumberParam, useQueryParam} from "use-query-params";
import api from "./api/api";
import styled from "styled-components";
import {FaPen, FaSatelliteDish, FaSave} from "react-icons/fa";
import {GeoPointsHook, useGeoPoints} from "./hooks/useGeoPoints";
import {Waypoint} from "./api/models/Waypoint";


const Toolbar = styled.ul`
  display: flex;
  flex-flow: row wrap;
  padding: 1rem 0;

  button:not(:first-child):not(:last-child) {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;


function App() {
    const startPos = new LatLng(55.4331145, 37.5562910);

    const [drawMode, setDrawMode] = useState(false);
    const routePoints: GeoPointsHook = useGeoPoints();

    const [routeId, setRouteId] = useQueryParam("routeId", NumberParam);
    const [selectedTour, setSelectedTour] = useState<TourRoute>();

    const [mapInstance, setMapInstance] = useState<LeafletMap>();
    const [userPosition, setUserPosition] = useState<LatLng>();

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
            <Sidebar activeRouteId={routeId} setRouteId={setRouteId} selectedTour={selectedTour}/>
            <Container>
                <h1>React Typescript Leaflet TEST</h1>
                <h6>{selectedTour?.title}</h6>
                <Toolbar>
                    <ToolButton label={"Нанести маршрут"} icon={<FaPen/>} active={drawMode}
                                onClick={() => setDrawMode(!drawMode)}/>

                    <ToolButton label={"Моё местоположение"} icon={<FaSatelliteDish/>}
                                onClick={() => {
                                    if (mapInstance && userPosition) mapInstance.panTo(userPosition);
                                }}/>

                    <ToolButton label={"Сохранить изменения"} icon={<FaSave/>}
                                onClick={() => {
                                    if (!selectedTour) return;

                                    const newTour: TourRoute = {...selectedTour};
                                    newTour.waypoints = routePoints.points.map(value => Waypoint.fromLatLng(selectedTour.id, value));
                                    setSelectedTour(newTour);
                                    console.log(newTour);
                                }}/>
                </Toolbar>

                <MapView setMapInstance={setMapInstance} setUserPosition={setUserPosition} startPosition={startPos}
                         defaultZoom={13}
                         drawEnabled={drawMode} tour={selectedTour} routePoints={routePoints}/>
            </Container>
        </>
    );
}

export default App;
