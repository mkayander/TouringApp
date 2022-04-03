import styled from "styled-components";
import React, { HTMLAttributes } from "react";

const Container = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1102;
  pointer-events: none;
`;

const View = styled.div`
  padding: 1rem 1rem;
  margin: auto 1rem;
  border-radius: 10px;
  min-width: 40%;
  max-width: 600px;
  //min-height: 600px;
  overflow: hidden;
  background: #393f4c;
  //background: darkcyan;
  z-index: 1103;
  box-shadow: rgba(0, 0, 0, 0.15) 0 0.5rem 1rem;
  pointer-events: auto;

  h4 {
    text-align: center;
    text-transform: capitalize;
  }
`;

type ModalProps = {
  modalTitle: string;
};

export const ModalBase: React.FC<
  HTMLAttributes<HTMLDivElement> & ModalProps
> = ({ children, modalTitle }) => {
  return (
    <Container>
      <View>
        <h4>{modalTitle}</h4>
        <hr />
        {children}
      </View>
    </Container>
  );
};
