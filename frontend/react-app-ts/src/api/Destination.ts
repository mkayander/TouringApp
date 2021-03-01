import {TimestampModel} from "./models/mixins/TimestampModel";
import {LatLngModel} from "./models/mixins/LatLngModel";
import {DestinationPhoto} from "./models/DestinationPhoto";

export type Destination = TimestampModel & LatLngModel & {
    title: string,
    type: string,
    radius: number,
    description: string,
    photos: DestinationPhoto[]
}