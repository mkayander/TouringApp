import {TimestampModel} from "./mixins/TimestampModel";
import {LatLngModel} from "./mixins/LatLngModel";
import {DestinationPhoto} from "./DestinationPhoto";

export type Destination = TimestampModel & LatLngModel & {
    pk: number,
    title: string,
    type: string,
    address: string,
    radius: number,
    description: string,
    photos?: DestinationPhoto[]
}