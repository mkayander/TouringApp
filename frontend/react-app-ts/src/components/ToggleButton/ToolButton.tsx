import React from "react";
import classNames from "classnames";
import { StyledButton } from "../styled/StyledButton";

type ToggleButtonProps = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

export const ToolButton: React.FC<
  React.HTMLAttributes<HTMLButtonElement> & ToggleButtonProps
> = ({ label, icon, active, ...rest }) => {
  const classes = classNames({
    active: active,
  });

  return (
    <StyledButton className={classes} title={label} active={active} {...rest}>
      {icon}
    </StyledButton>
  );
};
