import {TimestampModel} from "./mixins/TimestampModel";
import {Waypoint, WaypointType} from "./Waypoint";
import {Destination} from "./Destination";
import {PackableApiModel} from "./mixins/PackableApiModel";


export type TourRouteResponse = TimestampModel & {
    pk: number,
    title: string,
    description: string,
    image?: URL,
    waypoints: WaypointType[]
    destinations: Destination[]
}


export class TourRoute implements TimestampModel, PackableApiModel {
    pk: number;
    created_at?: Date;
    updated_at?: Date;
    title: string;
    description: string;
    image?: URL;
    waypoints: Waypoint[];
    destinations: Destination[];

    // constructor(args: TourRouteResponse) {
    //     this.pk = args.pk;
    //     this.created_at = args.created_at && new Date(args.created_at);
    //     this.updated_at = args.updated_at && new Date(args.updated_at);
    //     this.title = args.title;
    //     this.description = args.description;
    //     this.image = args.image;
    //     this.waypoints = args.waypoints?.map(value => new Waypoint(value)) || [];
    //     this.destinations = args.destinations;
    // }


    constructor(pk: number, title: string, description: string, waypoints: Waypoint[], destinations: Destination[],
                created_at?: Date, updated_at?: Date, image?: URL) {
        this.pk = pk;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.title = title;
        this.description = description;
        this.image = image;
        this.waypoints = waypoints;
        this.destinations = destinations;
    }

    public static fromApiResponse(args: TourRouteResponse) {
        return new TourRoute(
            args.pk,
            args.title,
            args.description,
            args.waypoints?.map(value => new Waypoint(value)),
            args.destinations,
            args.created_at && new Date(args.created_at),
            args.updated_at && new Date(args.updated_at),
            args.image
        );
    }

    public packData(): TourRouteResponse {
        return {
            pk: this.pk,
            title: this.title,
            description: this.description,
            // image: this.image,
            waypoints: this.waypoints.map((waypoint, index) => waypoint.packData(this.pk, index)),
            destinations: this.destinations?.map(destination => {
                delete destination.photos;
                return destination;
            })
        };
    }

    public clone() {
        return new TourRoute(
            this.pk,
            this.title,
            this.description,
            this.waypoints,
            this.destinations,
            this.created_at,
            this.updated_at,
            this.image
        );
    }
}

// export type TourRoute = TimestampModel & {
//     id: number,
//     title: string,
//     description: string,
//     image: URL,
//     waypoints?: Waypoint[]
// }