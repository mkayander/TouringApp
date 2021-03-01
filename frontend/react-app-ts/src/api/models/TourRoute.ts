import {TimestampModel} from "./mixins/TimestampModel";

export type TourRoute = TimestampModel & {
    id: number,
    title: string,
    description: string,
    image: URL,
}