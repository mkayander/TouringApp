import React from "react";
import styled from "styled-components";

type ToggleButtonProps = {
    label: string,
    iconUrl: string,
    active: boolean,
    callback: () => void
}

type StyleProps = {
    active: boolean
}

const StyledButton = styled.button<StyleProps>`
  transition: 0.2s;
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: ${(props) => props.active ? "cyan" : "darkcyan"};
  box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 8%);

  img {
    height: 70%;
    width: 70%;
    object-fit: contain;
  }
`;

export const ToolButton: React.FC<ToggleButtonProps> = ({label, iconUrl, active, callback}) => {
    console.log(iconUrl);

    return (
        <StyledButton title={label} style={{backgroundImage: `url(${iconUrl})`}}
                      onClick={callback} active={active}>
            <img src={iconUrl} alt={"Tool Icon"}/>
        </StyledButton>
    );
};
