import React, {useEffect, useState} from 'react';
import {Menu, MenuItem, ProSidebar, SidebarContent, SidebarHeader, SubMenu} from 'react-pro-sidebar';
import {FaGem, FaRoute} from "react-icons/fa";
import 'react-pro-sidebar/dist/css/styles.css';
import {TourRoute, TourRouteResponse} from "../../api/models/TourRoute";
import api from "../../api/api";
import {TourRouteHook} from "../../hooks/useTourRoute";


export type SidebarProps = {
    routeHook: TourRouteHook
}


export const Sidebar: React.FC<SidebarProps> = ({routeHook}) => {
    const {routeId, setRouteId, activeRoute} = routeHook;

    const [routes, setRoutes] = useState<TourRoute[]>([]);

    useEffect(() => {
        api.get<TourRouteResponse[]>("routes/")
            .then(value => {
                const result = value.data.map(value => {
                    return TourRoute.fromApiResponse(value);
                });
                setRoutes(result);
            })
            .catch(reason => {
                console.error(reason);
            });
    }, []);

    console.log(routes);

    return (
        <ProSidebar collapsed={false}
                    breakPoint={"md"}>
            <SidebarHeader>
                <div
                    style={{
                        padding: '24px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: 14,
                        letterSpacing: '1px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    Навигация
                </div>
            </SidebarHeader>

            <SidebarContent>
                <Menu iconShape="square">
                    <MenuItem icon={<FaGem/>}>Dashboard</MenuItem>
                    <SubMenu title="Маршруты" icon={<FaRoute/>} defaultOpen={true}>
                        {routes.map(route => (
                            <MenuItem key={route.pk} active={route.pk === routeId}
                                      onClick={() => setRouteId(route.pk)}>{route.title}</MenuItem>
                        ))}
                    </SubMenu>
                </Menu>
                <Menu>
                    {activeRoute && (
                        <>
                            <MenuItem>Информация о маршруте</MenuItem>
                            <MenuItem>Кол-во точек: {activeRoute.waypoints.length}</MenuItem>
                        </>
                    )}
                </Menu>
            </SidebarContent>

        </ProSidebar>
    );
};