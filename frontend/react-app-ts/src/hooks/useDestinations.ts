import {useEffect} from "react";
import {TourRouteHook} from "./useTourRoute";
import {Destination} from "../api/models/Destination";
import {ArrayHook, useGenericArrayHook} from "./generics/useGenericArrayHook";

interface DestinationHook extends ArrayHook<Destination> {
    updateDestination(item: Destination): boolean
}

export const useDestinations = (routeHook: TourRouteHook): DestinationHook => {
    const arrayHook = useGenericArrayHook<Destination>([]);
    const {state: destinations, setState: setDestinations} = arrayHook;

    useEffect(() => {
        const newPoints = routeHook.activeRoute?.destinations;
        if (newPoints !== undefined) {
            // setPoints(newPoints);
        }
    }, [routeHook.activeRoute?.destinations]);

    const updateDestination = (newItem: Destination): boolean => {
        const newList = destinations;
        let isSuccessfull = false;
        destinations.every((value, index) => {
            if (newItem.pk === value.pk) {
                newList.splice(index, 1, newItem);
                setDestinations(newList);
                isSuccessfull = true;
                return false;
            }
        });

        return isSuccessfull;
    };

    return {
        updateDestination,
        ...arrayHook
    };
};
