from django.db import models

from routes.choices import DESTINATION_TYPES


class TimestampModelMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")

    class Meta:
        abstract = True


class GeoPointMixin(models.Model):
    longitude = models.DecimalField(verbose_name="Долгота", max_digits=9, decimal_places=6)
    latitude = models.DecimalField(verbose_name="Широта", max_digits=9, decimal_places=6)

    class Meta:
        abstract = True


class Route(TimestampModelMixin):
    title = models.CharField(max_length=64, verbose_name="Название", unique=True)
    description = models.TextField(verbose_name="Описание", null=True, blank=True)
    image = models.ImageField(verbose_name="Изображение",
                              help_text="Основное изображение/фото, представляющее маршрут.",
                              upload_to="route_headers/", null=True, blank=True)

    class Meta:
        verbose_name = "Маршрут"
        verbose_name_plural = "Маршруты"


class Waypoint(TimestampModelMixin, GeoPointMixin):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="waypoints")
    label = models.CharField(verbose_name="Метка", max_length=32, null=True, blank=True)

    class Meta:
        verbose_name = "Путевая точка"
        verbose_name_plural = "Путевые точки"
        constraints = [
            models.UniqueConstraint(fields=["route", "longitude", "latitude"], name="unique_waypoint")
        ]


class Destination(TimestampModelMixin, GeoPointMixin):
    route = models.ForeignKey(Route, verbose_name="Маршрут", on_delete=models.CASCADE,
                              related_name="destinations")
    title = models.CharField(verbose_name="Название", max_length=64)
    type = models.CharField(verbose_name="Тип", max_length=16, choices=DESTINATION_TYPES)
    radius = models.PositiveIntegerField(verbose_name="Радиус области входа", help_text="В метрах", default=8)
    description = models.TextField(verbose_name="Описание", null=True, blank=True)

    class Meta:
        verbose_name = "Пункт назначения"
        verbose_name_plural = "Пункты назначения"
        constraints = [
            models.UniqueConstraint(fields=["title", "longitude", "latitude"], name="unique_destination")
        ]


class DestinationPhoto(TimestampModelMixin):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(verbose_name="Фотография", upload_to="destination_photos/")

    class Meta:
        verbose_name = "Фотография точки"
        verbose_name_plural = "Фотографии точек"
