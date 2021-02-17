# Generated by Django 3.1.6 on 2021-02-17 21:37

from django.db import migrations, models
import django.db.models.deletion
import routes.models


class Migration(migrations.Migration):

    dependencies = [
        ('routes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Destination',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=64, verbose_name='Название')),
                ('type', models.CharField(choices=[('simple', 'Простая точка'), ('sight', 'Достопримечательность'), ('important', 'Важное')], max_length=16, verbose_name='Тип')),
                ('description', models.TextField(verbose_name='Описание')),
            ],
            bases=(routes.models.TimestampModelMixin, routes.models.GeoPointMixin),
        ),
        migrations.CreateModel(
            name='DestinationPhoto',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='destination_photos/', verbose_name='Фотография')),
                ('destination', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='routes.destination')),
            ],
            bases=[routes.models.TimestampModelMixin],
        ),
    ]