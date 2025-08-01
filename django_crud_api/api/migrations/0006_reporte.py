# Generated by Django 5.2.3 on 2025-07-31 03:18

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_sancion'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Reporte',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('motivo', models.TextField()),
                ('estado', models.CharField(choices=[('pendiente', 'Pendiente'), ('revisando', 'En Revisión'), ('resuelto', 'Resuelto'), ('desestimado', 'Desestimado')], default='pendiente', max_length=20)),
                ('fecha_reporte', models.DateTimeField(auto_now_add=True)),
                ('fecha_resolucion', models.DateTimeField(blank=True, null=True)),
                ('notas_moderador', models.TextField(blank=True, null=True)),
                ('moderador_asignado', models.ForeignKey(blank=True, limit_choices_to={'is_staff': True}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reportes_asignados', to=settings.AUTH_USER_MODEL)),
                ('publicacion_reportada', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reportes', to='api.publicacion')),
                ('usuario_reportante', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reportes_realizados', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-fecha_reporte'],
                'unique_together': {('publicacion_reportada', 'usuario_reportante')},
            },
        ),
    ]
