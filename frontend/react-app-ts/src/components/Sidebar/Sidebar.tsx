import React, {useEffect, useState} from 'react';
import {Menu, MenuItem, ProSidebar, SidebarContent, SidebarHeader, SubMenu} from 'react-pro-sidebar';
import {FaGem, FaRoute} from "react-icons/fa";
import 'react-pro-sidebar/dist/css/styles.css';
import {TourRoute} from "../../api/models/TourRoute";
import api from "../../api/api";


export const Sidebar: React.FC = () => {
    const [routes, setRoutes] = useState<TourRoute[]>([]);
    const aasd = Set;

    useEffect(() => {
        api.get<TourRoute[]>("routes/")
            .then(value => {
                console.log(value);
                setRoutes(value.data);
                console.log(routes);
            })
            .catch(reason => {
                console.error(reason);
            });
    }, []);

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
                            <MenuItem key={route.id}>{route.title}</MenuItem>
                        ))}
                        {/*<MenuItem>Component 1</MenuItem>*/}
                    </SubMenu>
                </Menu>
            </SidebarContent>

        </ProSidebar>
    );
};