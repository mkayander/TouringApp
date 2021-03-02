import React from "react";
import styled from "styled-components";
import classNames from "classnames";


type StyleProps = {
    active?: boolean
}

const StyledButton = styled.button<StyleProps>`
  transition: 0.2s;
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: ${(props) => props.active ? "cyan" : "darkcyan"};
  box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 8%);
  color: ${(props) => props.active ? "white" : "gainsboro"};
  
  :active {
    background: cyan;
    color: white;
  }

  & > * {
    height: 70%;
    width: 70%;
    object-fit: contain;
  }

  .active {
    color: black;
    box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 50%);
  }
`;


type ToggleButtonProps = {
    label: string,
    icon: React.ReactNode,
    active?: boolean
}

export const ToolButton: React.FC<ToggleButtonProps & React.HTMLAttributes<HTMLButtonElement>> = ({
                                                                                                      label,
                                                                                                      icon,
                                                                                                      active,
                                                                                                      ...rest
                                                                                                  }) => {
    const classes = classNames({
        active: active
    });

    return (
        <StyledButton className={classes} title={label} active={active} {...rest}>
            {/*<img src={iconUrl} alt={"Tool Icon"}/>*/}
            {icon}
        </StyledButton>
    );
};
