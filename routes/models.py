from django.db import models


class TimestampModelMixin:
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")

    # class Meta:
    #     abstract = True


class Route(models.Model, TimestampModelMixin):
    title = models.CharField(max_length=64, verbose_name="Название", unique=True)
    description = models.TextField(verbose_name="Описание")
    image = models.ImageField(verbose_name="Изображение",
                              help_text="Основное изображение/фото, представляющее маршрут.",
                              upload_to="route_headers/")

    class Meta:
        verbose_name = "Маршрут"
        verbose_name_plural = "Маршруты"


class Waypoint(models.Model, TimestampModelMixin):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="waypoints")
    label = models.CharField(verbose_name="Метка", max_length=32, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)

    class Meta:
        verbose_name: "Путевая точка"
        verbose_name_plural: "Путевые точки"
        constraints: [
            models.UniqueConstraint(fields=["route", "longitude", "latitude"], name="unique_waypoint")
        ]
