from rest_framework import viewsets, mixins
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

    def update(self, request, *args, **kwargs):
        print("View data:", dict(request.data))
        return super().update(request, *args, **kwargs)

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
