import {useEffect} from "react";
import {TourRouteHook} from "./useTourRoute";
import {Destination} from "../api/models/Destination";
import {ArrayHook, useNestedGenericArrayHook} from "./generics/useGenericArrayHook";
import {LatLng} from "leaflet";

export interface DestinationsHook extends ArrayHook<Destination> {
    updateDestination(item: Destination): boolean
    updateLocation(index: number, latLng: LatLng): boolean
}

export const useDestinations = (routeHook: TourRouteHook): DestinationsHook => {
    const arrayHook = useNestedGenericArrayHook<Destination>([],
        routeHook.activeRoute?.destinations || [],
        destinations => {
            routeHook.updateDestinations(destinations);
        });
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

    const updateLocation = (index: number, latLng: LatLng): boolean => {
        if (!(index in destinations)) return false;

        destinations.splice(index, 1, {
            ...destinations[index],
            latitude: latLng.lat,
            longitude: latLng.lng,
        });
        setDestinations(destinations);

        return true;
    };

    return {
        updateDestination,
        updateLocation,
        ...arrayHook
    };
};
