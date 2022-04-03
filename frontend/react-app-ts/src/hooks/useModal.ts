import { useState } from "react";
import { CreateRouteModal } from "../components/Modal/CreateRouteModal";
import { TourRouteHook } from "./useTourRoute";

export enum ModalType {
  CreateRoute,
}

export type DefaultModalProps = {
  closeModal?: Function;
};

export const useModal = (routeHook: TourRouteHook) => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const closeModal = () => {
    setActiveModal(null);
  };

  const getModalComponent = () => {
    switch (activeModal) {
      case ModalType.CreateRoute:
        const fc = CreateRouteModal;
        fc.defaultProps = {
          closeModal: closeModal,
          routeHook: routeHook,
        };
        return fc;

      default:
        return null;
    }
  };

  return { activeModal, setActiveModal, getModalComponent };
};

export type ModalHook = ReturnType<typeof useModal>;
