from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('routes', views.RouteViewSet)
router.register('waypoints', views.WaypointsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
