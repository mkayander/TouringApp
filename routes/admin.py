from django.contrib import admin

from routes.models import Route, Waypoint, Destination, DestinationPhoto


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    pass


@admin.register(Waypoint)
class WaypointAdmin(admin.ModelAdmin):
    list_display = ["__str__", "route", "index"]
    list_filter = ["route"]


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    pass


@admin.register(DestinationPhoto)
class DestinationPhotoAdmin(admin.ModelAdmin):
    pass
