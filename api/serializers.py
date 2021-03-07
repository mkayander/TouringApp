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
    photos = DestinationPhotoSerializer(many=True)

    class Meta:
        model = Destination
        fields = ['route', 'longitude', 'latitude', 'title', 'type', 'radius', 'description', 'created_at',
                  'updated_at', 'photos']
        nested_list_fields = ['photos']

    def create(self, validated_data):
        print(validated_data)
        children_data = {}
        for field_name in self.Meta.nested_list_fields:
            children_data.update({field_name: validated_data.pop(field_name)})

        instance = self.Meta.model.objects.create(**validated_data)

        for name, data in children_data:
            self.get_attribute(name).Meta.model.objects.create(**data)

        # children_data = validated_data.pop(self.nested_list_fields[0])
        # for child_data in children_data:
        #     self.model.objects.create(**child_data)

        return instance

    def update(self, instance, validated_data):
        print(validated_data)
        children_data = {}
        for field_name in self.Meta.nested_list_fields:
            children_data.update({field_name: validated_data.pop(field_name)})

        instance = self.Meta.model.objects.update(**validated_data)

        for name, data in children_data:
            self.get_attribute(name).Meta.model.objects.update_or_create(**data)
            print(self.get_attribute(name).Meta)

        # children_data = validated_data.pop(self.nested_list_fields[0])
        # for child_data in children_data:
        #     self.model.objects.create(**child_data)

        return instance

    # def update(self, instance, validated_data):
    #     waypoints_data = validated_data.pop('waypoints')
    #     route = Route.objects.update(**validated_data)
    #
    #     for waypoint_data in waypoints_data:
    #         Waypoint.objects.update_or_create(route=route, **waypoint_data)
    #
    #     return route


class RouteSerializer(serializers.ModelSerializer):
    waypoints = WaypointSerializer(many=True, required=False)
    destinations = DestinationSerializer(many=True, required=False)

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
        fields = ['pk', 'title', 'description', 'image', 'created_at', 'updated_at']
