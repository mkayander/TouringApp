from rest_framework import serializers

from routes.models import Route, Waypoint, Destination, DestinationPhoto


class WaypointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waypoint
        fields = ['id', 'route', 'label', 'longitude', 'latitude', 'created_at', 'updated_at']


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
    waypoints = WaypointSerializer(many=True)
    destinations = DestinationSerializer(many=True)

    class Meta:
        model = Route
        fields = ['id', 'title', 'description', 'image', 'created_at', 'updated_at', 'waypoints', 'destinations']

    def create(self, validated_data):
        waypoints_data = validated_data.pop('waypoints')
        destinations_data = validated_data.pop('destinations')
        route = Route.objects.create(**validated_data)

        for waypoint_data in waypoints_data:
            Waypoint.objects.create(route=route, **waypoint_data)

        for destination_data in destinations_data:
            Destination.objects.create(route=route, **destination_data)

        return route

    def update(self, instance, validated_data):
        waypoints_data = validated_data.pop('waypoints')
        destinations_data = validated_data.pop('destinations')
        route = Route.objects.update(**validated_data)

        for waypoint_data in waypoints_data:
            Waypoint.objects.update_or_create(route=route, **waypoint_data)

        for destination_data in destinations_data:
            Destination.objects.update_or_create(route=route, **destination_data)

        return route


class RouteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ['id', 'title', 'description', 'image', 'created_at', 'updated_at']
