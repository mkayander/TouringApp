import {TimestampModel} from "./mixins/TimestampModel";
import {LatLngModel} from "./mixins/LatLngModel";
import {LatLng} from "leaflet";

export type WaypointType = TimestampModel & LatLngModel & {
    route: number,
    label: string,
}

export class Waypoint implements TimestampModel {
    route: number;
    label: string;
    latLng: LatLng;
    created_at?: Date;
    updated_at?: Date;

    constructor(args: WaypointType) {
        this.route = args.route;
        this.label = args.label;
        this.latLng = new LatLng(args.latitude, args.longitude);
        this.created_at = args.created_at && new Date(args.created_at);
        this.updated_at = args.updated_at && new Date(args.updated_at);
    }

    public static fromLatLng(routeId: number, latLng: LatLng, label: string = "") {
        return new Waypoint({
            label: label,
            latitude: latLng.lat,
            longitude: latLng.lng,
            route: routeId
        });
    }
}