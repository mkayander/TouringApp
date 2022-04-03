import { CircleMarker, Polyline, useMapEvents } from "react-leaflet";
import { WaypointsHook } from "../../hooks/useWaypoints";
import L, { LatLng } from "leaflet";
import React, { useState } from "react";
import { TourRouteHook } from "../../hooks/useTourRoute";
import { EditTool, EditToolsHook } from "../../hooks/useEditTools";
import { Waypoint } from "../../api/models/Waypoint";

type DrawControllerProps = {
  routeHook: TourRouteHook;
  waypointsHook: WaypointsHook;
  toolsHook: EditToolsHook;
};

const getClosestWaypointIndex = (
  points: Waypoint[],
  target: LatLng
): number => {
  return points
    .map((value) => value.latLng.distanceTo(target))
    .reduce((iMax, val, i, arr) => (val < arr[iMax] ? i : iMax), 0);
};

export const DrawController: React.FC<DrawControllerProps> = ({
  toolsHook,
  waypointsHook,
}) => {
  const { state, addPos, insertPos, removeItem } = waypointsHook;
  const [hoverPoint, setHoverPoint] = useState<LatLng | null>(null);
  const [targetWaypointIndex, setTargetWaypointIndex] = useState<number | null>(
    null
  );
  const { activeTool } = toolsHook;

  useMapEvents({
    click(e) {
      console.log("Map click: ", e.latlng);
      switch (activeTool) {
        case EditTool.Draw:
          addPos(e.latlng);
          break;

        case EditTool.Insert:
          if (targetWaypointIndex !== null) {
            insertPos(e.latlng, targetWaypointIndex + 1);
          }
          break;

        case EditTool.Delete:
          if (targetWaypointIndex !== null) {
            removeItem(state[targetWaypointIndex]);
            setTargetWaypointIndex(null);
          }
          break;
      }
    },
    mousemove(e) {
      if (activeTool === null) return;

      setHoverPoint(e.latlng);

      if (activeTool === EditTool.Delete || activeTool === EditTool.Insert) {
        setTargetWaypointIndex(getClosestWaypointIndex(state, e.latlng));
      }
    },
    mouseout() {
      setHoverPoint(null);
      setTargetWaypointIndex(null);
    },
  });

  const color = "red";

  const lastItem = waypointsHook.lastItem();

  return (
    <div>
      {waypointsHook.isNotEmpty() ? (
        <>
          {/*Start marker*/}
          <CircleMarker center={state[0].latLng} radius={2} color={color} />

          {hoverPoint && (
            <>
              {/* Draw tool rendering */}
              {activeTool === EditTool.Draw && lastItem && (
                <Polyline
                  positions={[lastItem.latLng, hoverPoint]}
                  color={color}
                  opacity={0.5}
                />
              )}

              {/* Delete tool rendering */}
              {activeTool === EditTool.Delete &&
                targetWaypointIndex !== null &&
                state[targetWaypointIndex] && (
                  <CircleMarker
                    center={state[targetWaypointIndex].latLng}
                    radius={5}
                    color={"orange"}
                    opacity={0.75}
                  />
                )}

              {/* Insert tool rendering */}
              {activeTool === EditTool.Insert && targetWaypointIndex !== null && (
                <>
                  <Polyline
                    positions={[state[targetWaypointIndex].latLng, hoverPoint]}
                    color={color}
                    opacity={0.5}
                  />
                  <Polyline
                    positions={[
                      hoverPoint,
                      state[Math.min(targetWaypointIndex + 1, state.length - 1)]
                        .latLng,
                    ]}
                    color={color}
                    opacity={0.5}
                  />
                </>
              )}
            </>
          )}
        </>
      ) : null}

      <Polyline
        positions={state.map((value) => value.latLng)}
        color={color}
        renderer={L.svg({ padding: 100 })}
      />

      {/*End marker*/}
      {lastItem && (
        <CircleMarker center={lastItem.latLng} radius={2} color={color} />
      )}
    </div>
  );
};
