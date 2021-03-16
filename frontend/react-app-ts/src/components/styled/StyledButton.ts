import styled from "styled-components";

type StyleProps = {
    active?: boolean
}

export const StyledButton = styled.button<StyleProps>`
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

  :hover:not(.active) {
    background: #00c4c4;
    box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 20%);
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