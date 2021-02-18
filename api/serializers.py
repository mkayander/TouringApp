from rest_framework import serializers
from rest_framework.fields import empty

from routes.models import Route, Waypoint, Destination, DestinationPhoto


class WaypointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waypoint
        fields = ['route', 'label', 'longitude', 'latitude', 'created_at', 'updated_at']


class DestinationPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationPhoto
        fields = ['destination', 'image', 'created_at', 'updated_at']


class DestinationSerializer(serializers.ModelSerializer):
    photos = DestinationPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Destination
        fields = ['route', 'longitude', 'latitude', 'title', 'type', 'radius', 'description', 'created_at',
                  'updated_at', 'photos']


class RouteSerializer(serializers.ModelSerializer):
    waypoints = WaypointSerializer(many=True, read_only=True)
    destinations = DestinationSerializer(many=True, read_only=True)

    class Meta:
        model = Route
        fields = ['id', 'title', 'description', 'image', 'created_at', 'updated_at', 'waypoints', 'destinations']


class RouteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ['id', 'title', 'description', 'image', 'created_at', 'updated_at']
