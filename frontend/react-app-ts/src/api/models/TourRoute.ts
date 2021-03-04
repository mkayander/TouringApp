import {TimestampModel} from "./mixins/TimestampModel";
import {Waypoint, WaypointType} from "./Waypoint";
import {Destination} from "../Destination";


export type TourRouteResponse = TimestampModel & {
    id: number,
    title: string,
    description: string,
    image: URL,
    waypoints?: WaypointType[]
    destinations?: Destination[]
}


export class TourRoute implements TimestampModel {
    id: number;
    created_at?: Date;
    updated_at?: Date;
    title: string;
    description: string;
    image: URL;
    waypoints: Waypoint[];
    destinations?: Destination[];

    constructor(args: TourRouteResponse) {
        this.id = args.id;
        this.created_at = args.created_at && new Date(args.created_at);
        this.updated_at = args.updated_at && new Date(args.updated_at);
        this.title = args.title;
        this.description = args.description;
        this.image = args.image;
        this.waypoints = args.waypoints?.map(value => new Waypoint(value)) || [];
        this.destinations = args.destinations;
    }

    public static packData(instance: TourRoute) {
        return {
            id: instance.id,
            title: instance.title,
            description: instance.description,
            // image: instance.image,
            waypoints: instance.waypoints,
            destinations: instance.destinations?.map(destination => {
                destination.photos.map(photo => {
                    // delete photo.image
                })
            })
        };
    }
}

export type TourRoutePack = ReturnType<typeof TourRoute.packData>

// export type TourRoute = TimestampModel & {
//     id: number,
//     title: string,
//     description: string,
//     image: URL,
//     waypoints?: Waypoint[]
// }