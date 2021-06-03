from django.contrib import admin

from routes.models import Route, Waypoint, Destination, DestinationPhoto


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ["title", "short_description", "image"]
    list_editable = ["short_description"]


@admin.register(Waypoint)
class WaypointAdmin(admin.ModelAdmin):
    list_display = ["__str__", "route", "index"]
    list_filter = ["route"]


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ["title", "route", "type", "radius", "address", "short_description", "description"]
    list_filter = ["route"]
    list_editable = ["type", "radius", "address", "short_description", "description"]


@admin.register(DestinationPhoto)
class DestinationPhotoAdmin(admin.ModelAdmin):
    pass
