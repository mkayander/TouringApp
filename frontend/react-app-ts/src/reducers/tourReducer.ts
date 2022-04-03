import { TourRoute } from "../api/models/TourRoute";

type TourState = {
  routeId: number;
  route: TourRoute;
};

export type Action =
  | { type: "SET_TITLE"; payload: string }
  | { type: "CLEAR_TITLE" };

export default function tourReducer(state: TourState, action: Action) {}
