import {useState} from "react";
import {CreateRouteModal} from "../components/Modal/CreateRouteModal";

export enum ModalType {
    CreateRoute
}

export const useModal = () => {
    const [activeModal, setActiveModal] = useState<ModalType>();

    const renderModal = () => {
        switch (activeModal) {
            case ModalType.CreateRoute:
                return CreateRouteModal;

            default:
                return null;
        }
    };

    return {activeModal, setActiveModal, getModalComponent: renderModal};
};

export type ModalHook = ReturnType<typeof useModal>
