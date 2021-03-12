from typing import Type, List

from django.db import IntegrityError
from django.db.models import Model
from rest_framework import viewsets, mixins
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response

from api.serializers import RouteSerializer, RouteListSerializer, WaypointSerializer
from routes.models import Route, Waypoint


class RouteViewSet(viewsets.GenericViewSet,
                   mixins.RetrieveModelMixin,
                   mixins.CreateModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.ListModelMixin):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    serializer_action_classes = {
        'list': RouteListSerializer,
    }

    def get_serializer_class(self):
        try:
            return self.serializer_action_classes[self.action]
        except (KeyError, AttributeError):
            return super().get_serializer_class()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


class WaypointsViewSet(viewsets.GenericViewSet,
                       mixins.CreateModelMixin):
    queryset = Waypoint.objects.all()
    serializer_class = WaypointSerializer


def get_and_update(model: Type[Model], **kwargs):
    pk = kwargs.pop('pk')
    obj = model.objects.get(pk=pk)
    for name, value in kwargs.items():
        setattr(obj, name, value)
    return obj


@api_view(['POST'])
def update_route_data(request: Request, route_pk: int):
    queryset = Route.objects.all()
    print(f"Route pk: {route_pk}")
    instance: Route = get_object_or_404(queryset, pk=route_pk)

    waypoints_raw_list = request.data.pop('waypoints')
    destinations_raw_list = request.data.pop('destinations')

    serializer = RouteSerializer(instance, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    waypoints_serializer = WaypointSerializer(data=waypoints_raw_list, many=True, partial=True)
    waypoints_serializer.is_valid(raise_exception=True)

    waypoints_backup: List[Waypoint] = list(instance.waypoints.all())

    new_waypoints: List[Waypoint] = [Waypoint(**data) for data in waypoints_serializer.validated_data]

    instance.waypoints.all().delete()
    try:
        instance.waypoints.bulk_create(new_waypoints)
    except (IntegrityError, AttributeError) as e:
        print(f"Failed to replace waypoints - {e} \n Loading backup...")
        instance.waypoints.bulk_create(waypoints_backup)

    return Response(RouteSerializer(Route.objects.get(pk=route_pk)).data, status=200)
