import { TimestampModel } from "./mixins/TimestampModel";
import { LatLngModel } from "./mixins/LatLngModel";
import { LatLng } from "leaflet";

export type WaypointType = TimestampModel &
  LatLngModel & {
    pk?: number;
    route?: number;
    index?: number;
    label: string;
  };

export class Waypoint implements TimestampModel {
  pk?: number;
  route?: number;
  index?: number;
  label: string;
  latLng: LatLng;
  created_at?: Date;
  updated_at?: Date;

  constructor(args: WaypointType) {
    this.index = args.index;
    this.pk = args.pk;
    this.route = args.route;
    this.label = args.label;
    this.latLng = new LatLng(args.latitude, args.longitude);
    this.created_at = args.created_at && new Date(args.created_at);
    this.updated_at = args.updated_at && new Date(args.updated_at);
  }

  public static fromLatLng(
    latLng: LatLng,
    index?: number,
    routeId?: number,
    label: string = ""
  ) {
    return new Waypoint({
      route: routeId,
      index: index,
      label: label,
      latitude: latLng.lat,
      longitude: latLng.lng,
    });
  }

  public clone() {
    return new Waypoint({
      pk: this.pk,
      route: this.route,
      label: this.label,
      latitude: this.latLng.lat,
      longitude: this.latLng.lng,
    });
  }

  public packData(routeId?: number, index?: number) {
    return {
      pk: this.pk,
      route: routeId || this.route,
      index: index,
      label: this.label,
      latitude: this.latLng.lat,
      longitude: this.latLng.lng,
    };
  }
}
