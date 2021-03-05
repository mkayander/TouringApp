from rest_framework import serializers

from routes.models import Route, Waypoint, Destination, DestinationPhoto


class WaypointSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waypoint
        fields = ['pk', 'route', 'label', 'longitude', 'latitude', 'created_at', 'updated_at']


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
        fields = ['pk', 'title', 'description', 'image', 'created_at', 'updated_at', 'waypoints', 'destinations']

    def create(self, validated_data):
        print(dict(validated_data))
        waypoints_data = validated_data.pop('waypoints')
        destinations_data = validated_data.pop('destinations')
        route = Route.objects.create(**validated_data)

        for waypoint_data in waypoints_data:
            Waypoint.objects.create(route=route, **waypoint_data)

        for destination_data in destinations_data:
            Destination.objects.create(route=route, **destination_data)

        return route

    def update(self, instance, validated_data):
        print(dict(validated_data))
        waypoints_list = validated_data.pop('waypoints')
        destinations_list = validated_data.pop('destinations')

        # The default update() implementation but without m2m fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        for waypoint_data in waypoints_list:
            print("Waypoint data: ", dict(waypoint_data))
            Waypoint.objects.update_or_create(**waypoint_data)

        for destination_data in destinations_list:
            Destination.objects.update_or_create(**destination_data)

        return instance


class RouteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ['id', 'title', 'description', 'image', 'created_at', 'updated_at']
