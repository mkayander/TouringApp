import {TimestampModel} from "./mixins/TimestampModel";
import {LatLngModel} from "./mixins/LatLngModel";
import {DestinationPhoto} from "./DestinationPhoto";

export type Destination = TimestampModel & LatLngModel & {
    title: string,
    type: string,
    radius: number,
    description: string,
    photos?: DestinationPhoto[]
}