from typing import Type, List, TypeVar

from django.db import IntegrityError
from django.db.models import Model
from django.db.models.manager import Manager
from rest_framework import viewsets, mixins
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from api.serializers import RouteSerializer, RouteListSerializer, WaypointSerializer, DestinationSerializer
from routes.models import Route, Waypoint


class RouteViewSet(viewsets.GenericViewSet,
                   mixins.RetrieveModelMixin,
                   mixins.CreateModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
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


T = TypeVar('T')


def process_data_repost(raw_list: List[T], serializer_class: Type[ModelSerializer], queryset: Type[Manager]):
    """
    Receive raw JSON data list from the POST request, deserialize the list, make a list of new Model instances,
    delete the existing models from given queryset, and repost the new data back. \n
    The existing data is being backed up to a variable, and saved back to the database if a error occurs while
    trying to save the new data.
    :param raw_list: Raw JSON list of data from, usually popped from request.data
    :param serializer_class: DRF serializer class for the needed django model
    :param queryset: A queryset where needed models exist. All of the existing models from that queryset
    would be deleted and replaced by the new data from the request
    """
    serializer = serializer_class(data=raw_list, many=True, partial=True)
    serializer.is_valid(raise_exception=True)
    waypoints_backup = list(queryset)
    new_waypoints = [serializer_class.Meta.model(**data) for data in serializer.validated_data]

    queryset.delete()
    try:
        queryset.bulk_create(new_waypoints)
    except (IntegrityError, AttributeError) as e:
        print(f"Failed to replace waypoints - {e} \n Loading backup...")
        queryset.bulk_create(waypoints_backup)


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

    process_data_repost(waypoints_raw_list, WaypointSerializer, instance.waypoints.all())

    process_data_repost(destinations_raw_list, DestinationSerializer, instance.destinations.all())

    return Response(RouteSerializer(Route.objects.get(pk=route_pk)).data, status=200)
