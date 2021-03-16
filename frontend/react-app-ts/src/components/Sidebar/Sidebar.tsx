import React from 'react';
import {Menu, MenuItem, ProSidebar, SidebarContent, SidebarHeader, SubMenu} from 'react-pro-sidebar';
import {FaGem, FaPlus, FaRoute} from "react-icons/fa";
import 'react-pro-sidebar/dist/css/styles.css';
import {TourRouteHook} from "../../hooks/useTourRoute";
import {ModalHook, ModalType} from "../../hooks/useModal";
import styled from "styled-components";
import {StyledButton} from "../styled/StyledButton";


export type SidebarProps = {
    routeHook: TourRouteHook
    modalHook: ModalHook
}


const AddButton = styled(StyledButton)`
  height: 40px;
  width: 40px;
  border-radius: 50%;

`;


export const Sidebar: React.FC<SidebarProps> = ({routeHook, modalHook}) => {
    const {routeId, setRouteId, activeRoute, routesList} = routeHook;

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
                        {routesList.map(route => (
                            <MenuItem key={route.pk} active={route.pk === routeId}
                                      onClick={() => setRouteId(route.pk)}>{route.title}</MenuItem>
                        ))}
                        <AddButton onClick={() => modalHook.setActiveModal(ModalType.CreateRoute)}>
                            <FaPlus/>
                        </AddButton>
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
