from rest_framework import serializers

from routes.models import Route, Waypoint, Destination, DestinationPhoto


class WaypointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waypoint
        fields = ['pk', 'route', 'index', 'label', 'longitude', 'latitude', 'created_at', 'updated_at']
        extra_kwargs = {'pk': {'read_only': False}}


class DestinationPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationPhoto
        fields = ['destination', 'image', 'created_at', 'updated_at']


class DestinationSerializer(serializers.ModelSerializer):
    photos = DestinationPhotoSerializer(many=True)

    class Meta:
        model = Destination
        fields = ['route', 'longitude', 'latitude', 'title', 'type', 'radius', 'description', 'created_at',
                  'updated_at', 'photos']
        nested_list_fields = ['photos']


class RouteSerializer(serializers.ModelSerializer):
    waypoints = WaypointSerializer(many=True, required=False)
    destinations = DestinationSerializer(many=True, required=False)

    class Meta:
        model = Route
        fields = ['pk', 'title', 'description', 'image', 'created_at', 'updated_at', 'total_distance',
                  'estimated_duration', 'waypoints', 'destinations']


class RouteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ['pk', 'title', 'short_description', 'description', 'image', 'created_at', 'updated_at']
