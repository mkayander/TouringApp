import {TimestampModel} from "./mixins/TimestampModel";

export type DestinationPhoto = TimestampModel & {
    destination: number,
    image: URL,
}