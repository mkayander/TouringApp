import sys
from io import BytesIO

from PIL import Image
from constance import config
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import models
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _
from geopy.distance import distance, Distance

from routes.choices import DESTINATION_TYPES


class TimestampModelMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")

    class Meta:
        abstract = True


class GeoPointMixin(models.Model):
    longitude = models.DecimalField(verbose_name="Долгота", max_digits=17, decimal_places=15)
    latitude = models.DecimalField(verbose_name="Широта", max_digits=17, decimal_places=15)

    class Meta:
        abstract = True


class Route(TimestampModelMixin):
    title = models.CharField(max_length=64, verbose_name="Название", unique=True)
    short_description = models.CharField(max_length=64, verbose_name="Короткое описание", null=True, blank=True)
    description = models.TextField(verbose_name="Описание", null=True, blank=True)
    image = models.ImageField(verbose_name="Изображение",
                              help_text="Основное изображение/фото, представляющее маршрут.",
                              upload_to="route_headers/", null=True, blank=True)

    class Meta:
        verbose_name = "Маршрут"
        verbose_name_plural = "Маршруты"

    def __str__(self):
        return self.title

    @cached_property
    def total_distance(self):
        lat_long_tuples = map((lambda point: (point.longitude, point.latitude)), self.waypoints.all())
        total_distance: Distance = distance(*lat_long_tuples)
        return round(total_distance.km, 3)

    @cached_property
    def estimated_duration(self):
        duration = self.total_distance / config.HUMAN_SPEED
        duration += config.DEFAULT_TIME_SPENDING / 60 * self.destinations.count()
        return round(duration * 60, 2)


class Waypoint(TimestampModelMixin, GeoPointMixin):
    index = models.PositiveIntegerField(verbose_name="Индекс", help_text="Порядковый номер путевой точки в маршруте")
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="waypoints")
    label = models.CharField(verbose_name="Метка", max_length=32, null=True, blank=True)

    def __str__(self):
        return f"{self.route.title} {self.label or '-'} {_('waypoint')} №{self.id}"

    class Meta:
        verbose_name = "Путевая точка"
        verbose_name_plural = "Путевые точки"
        constraints = [
            models.UniqueConstraint(fields=["route", "longitude", "latitude"], name="unique_waypoint"),
            models.UniqueConstraint(fields=["index", "route"], name="unique_route_waypoint_index")
        ]
        ordering = ['index']


class Destination(TimestampModelMixin, GeoPointMixin):
    route = models.ForeignKey(Route, verbose_name="Маршрут", on_delete=models.CASCADE,
                              related_name="destinations")
    title = models.CharField(verbose_name="Название", max_length=64)
    address = models.CharField(verbose_name="Адрес", max_length=128, null=True, blank=True)
    type = models.CharField(verbose_name="Тип", max_length=16, choices=DESTINATION_TYPES)
    radius = models.PositiveIntegerField(verbose_name="Радиус области входа", help_text="В метрах", default=8)
    short_description = models.CharField(verbose_name="Краткое описание", max_length=128, null=True, blank=True)
    description = models.TextField(verbose_name="Описание", null=True, blank=True)

    def __str__(self):
        return f"{self.route.title} {self.title} {_('destination')}"

    class Meta:
        verbose_name = "Пункт назначения"
        verbose_name_plural = "Пункты назначения"
        constraints = [
            models.UniqueConstraint(fields=["title", "longitude", "latitude"], name="unique_destination")
        ]


class DestinationPhoto(TimestampModelMixin):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(verbose_name="Фотография", upload_to="destination_photos/")

    def __str__(self):
        return f"{self.destination.title} {_('photo')} {self.image.name}"

    class Meta:
        verbose_name = "Фотография точки"
        verbose_name_plural = "Фотографии точек"

    def save(self, *args, **kwargs):
        img = Image.open(self.image)
        output = BytesIO()
        
        # img = img.resize((1920, 1080))
        
        img.save(output, format='JPEG', quality=40, optimize=True)
        output.seek(0)
        self.image = InMemoryUploadedFile(output, 'ImageField', f'{self.image.name.split(".")[0]}.jpg', 'image/jpeg',
                                          sys.getsizeof(output), None)

        super().save(*args, **kwargs)
