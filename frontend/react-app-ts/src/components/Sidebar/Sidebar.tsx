import React, {useState} from 'react';
import {Menu, MenuItem, ProSidebar, SidebarContent, SidebarHeader, SubMenu} from 'react-pro-sidebar';
import {FaGem, FaRoute} from "react-icons/fa";
import 'react-pro-sidebar/dist/css/styles.css';
import styled from "styled-components";

type OverlayProps = {
    active: boolean
}

const Overlay = styled.div<OverlayProps>`
  transition: 0.3s;
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background: #000000;
  z-index: 1001;
  opacity: ${({active}) => active ? "0.5" : "0"};
  pointer-events: ${({active}) => (active ? "auto" : "none")};
`;

export const Sidebar: React.FC = () => {
    const [opened, setOpened] = useState(false);

    return (
        <ProSidebar collapsed={false} onClick={() => setOpened(true)}
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
                    <SubMenu title="Маршруты" icon={<FaRoute/>}>
                        <MenuItem>Component 1</MenuItem>
                        <MenuItem>Component 2</MenuItem>
                    </SubMenu>
                </Menu>
            </SidebarContent>

        </ProSidebar>
    );
};