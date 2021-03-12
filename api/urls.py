from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('routes', views.RouteViewSet)
router.register('waypoints', views.WaypointsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('routes/repost/<int:route_pk>/', views.update_route_data, name="route_repost")
]
