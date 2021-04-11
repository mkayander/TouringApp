import React, {useEffect, useState} from 'react';
import {Container} from 'react-bootstrap';
import {LatLng, Map as LeafletMap} from "leaflet";
import './App.css';
import {ToolButton} from "./components/ToggleButton/ToolButton";
import {MapView} from "./components/MapView/MapView";
import {Sidebar} from "./components/Sidebar/Sidebar";
import {TourRoute} from "./api/models/TourRoute";
import {repostRouteData} from "./api/api";
import styled from "styled-components";
import {FaArrowAltCircleDown, FaPen, FaRemoveFormat, FaSatelliteDish, FaSave} from "react-icons/fa";
import {useWaypoints, WaypointsHook} from "./hooks/useWaypoints";
import {TourRouteHook, useTourRoute} from "./hooks/useTourRoute";
import {EditTool, useEditTools} from "./hooks/useEditTools";
import {toast} from "react-toastify";
import {useModal} from "./hooks/useModal";


const Toolbar = styled.ul`
  display: flex;
  flex-flow: row wrap;
  padding-bottom: 1rem;

  button:not(:first-child):not(:last-child) {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

type OverlayProps = {
    active: boolean
}

const Overlay = styled.div<OverlayProps>`
  transition: 0.3s;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: black;
  opacity: ${({active}) => active ? "0.6" : "0"};
  z-index: 1100;
  pointer-events: ${({active}) => (active ? "auto" : "none")};
`;


toast.configure({
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: false,
    draggable: true,
    pauseOnHover: true
});


function App() {
    const startPos = new LatLng(55.4331145, 37.5562910);

    const tools = useEditTools();

    // Waypoints hook
    const pointsHook: WaypointsHook = useWaypoints();

    // Tour route hook
    const routeHook: TourRouteHook = useTourRoute();
    const {routeId, activeRoute, setActiveRoute} = routeHook;

    const modalHook = useModal();

    const [mapInstance, setMapInstance] = useState<LeafletMap>();
    const [userPosition, setUserPosition] = useState<LatLng>();

    useEffect(() => {
        const newPoints = routeHook.activeRoute?.waypoints;
        if (newPoints && newPoints[0]) {
            mapInstance?.panTo(newPoints[0].latLng);
        }
    }, [mapInstance, routeHook.activeRoute]);

    const ModalComponent = modalHook.getModalComponent();

    return (
        <>
            <Sidebar routeHook={routeHook} modalHook={modalHook}/>
            <Container>
                <h1>React Typescript Leaflet TEST</h1>
                <h6>{activeRoute?.title}</h6>

                <div style={{display: "flex", flexFlow: "row wrap"}}>
                    <Toolbar>
                        <ToolButton label={"Нанести маршрут"} icon={<FaPen/>}
                                    active={tools.activeTool === EditTool.Draw}
                                    onClick={() => tools.toggleTool(EditTool.Draw)}/>

                        <ToolButton label={"Удалить точки маршрута"} icon={<FaRemoveFormat/>}
                                    active={tools.activeTool === EditTool.Delete}
                                    onClick={() => tools.toggleTool(EditTool.Delete)}/>

                        <ToolButton label={"Вставить точки маршрута"} icon={<FaArrowAltCircleDown/>}
                                    active={tools.activeTool === EditTool.Insert}
                                    onClick={() => tools.toggleTool(EditTool.Insert)}/>
                    </Toolbar>

                    <Toolbar style={{justifyContent: "end", marginLeft: "auto"}}>
                        <ToolButton label={"Моё местоположение"} icon={<FaSatelliteDish/>}
                                    style={{margin: "0 1rem"}}
                                    onClick={() => {
                                        if (mapInstance && userPosition) mapInstance.panTo(userPosition);
                                    }}/>

                        <ToolButton label={"Сохранить изменения"} icon={<FaSave/>}
                                    onClick={() => {
                                        if (!activeRoute) return;

                                        const newTour: TourRoute = activeRoute.clone();
                                        newTour.waypoints = pointsHook.points;

                                        repostRouteData(newTour)
                                            .then(route => {
                                                setActiveRoute(route);
                                                toast.success(`✅ Тур "${route.title}" сохранён успешно!`);
                                            });
                                    }}/>
                    </Toolbar>
                </div>

                <MapView setMapInstance={setMapInstance} setUserPosition={setUserPosition} startPosition={startPos}
                         defaultZoom={13}
                         toolsHook={tools} routeHook={routeHook}
                         waypointsHook={pointsHook}/>
            </Container>

            {ModalComponent && <ModalComponent/>}

            <Overlay active={modalHook.activeModal !== undefined} onClick={() => {
                modalHook.setActiveModal(undefined);
            }}/>
        </>
    );
}

export default App;
