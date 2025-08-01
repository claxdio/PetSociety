# Generated by Django 5.2.3 on 2025-07-31 02:59

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_publicacion_options_publicacion_fecha_creacion_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Agenda',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(default='Agenda de cuidados', max_length=200)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('fecha_actualizacion', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50, unique=True)),
                ('descripcion', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name_plural': 'Categorías',
                'ordering': ['nombre'],
            },
        ),
        migrations.RemoveField(
            model_name='publicacion',
            name='comentarios',
        ),
        migrations.RemoveField(
            model_name='publicacion',
            name='imagen',
        ),
        migrations.AddField(
            model_name='publicacion',
            name='tipo_publicacion',
            field=models.CharField(choices=[('general', 'General'), ('adopcion', 'Adopción'), ('mascota_perdida', 'Mascota Perdida'), ('otro', 'Otro')], default='general', max_length=20),
        ),
        migrations.CreateModel(
            name='ArchivoPublicacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo_archivo', models.CharField(choices=[('imagen', 'Imagen'), ('video', 'Video'), ('gif', 'GIF'), ('otro', 'Otro')], default='imagen', max_length=10)),
                ('ruta_archivo', models.URLField(max_length=500)),
                ('fecha_subida', models.DateTimeField(auto_now_add=True)),
                ('publicacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='archivos', to='api.publicacion')),
            ],
            options={
                'ordering': ['fecha_subida'],
            },
        ),
        migrations.AddField(
            model_name='publicacion',
            name='categorias',
            field=models.ManyToManyField(blank=True, related_name='publicaciones', to='api.categoria'),
        ),
        migrations.CreateModel(
            name='Comentario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contenido', models.TextField()),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('es_oculto', models.BooleanField(default=False)),
                ('publicacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comentarios', to='api.publicacion')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comentarios_realizados', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['fecha_creacion'],
            },
        ),
        migrations.CreateModel(
            name='EventoAgenda',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo_evento', models.CharField(choices=[('vacuna', 'Vacuna'), ('veterinario', 'Visita Veterinario'), ('desparasitacion', 'Desparasitación'), ('peluqueria', 'Peluquería'), ('revision', 'Revisión General'), ('cuidado', 'Cuidado Especial'), ('otro', 'Otro')], max_length=20)),
                ('motivo', models.CharField(max_length=200)),
                ('fecha_evento', models.DateTimeField()),
                ('veterinario', models.CharField(blank=True, max_length=100, null=True)),
                ('lugar', models.CharField(blank=True, max_length=200, null=True)),
                ('costo', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('estado', models.CharField(choices=[('pendiente', 'Pendiente'), ('completada', 'Completada'), ('cancelada', 'Cancelada')], default='pendiente', max_length=20)),
                ('fecha_completado', models.DateTimeField(blank=True, null=True)),
                ('notas_completado', models.TextField(blank=True, null=True)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('fecha_actualizacion', models.DateTimeField(auto_now=True)),
                ('agenda', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='eventos', to='api.agenda')),
            ],
            options={
                'ordering': ['fecha_evento'],
            },
        ),
        migrations.CreateModel(
            name='Mascota',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('especie', models.CharField(max_length=50)),
                ('foto', models.URLField(blank=True, null=True)),
                ('direccion', models.TextField(blank=True, null=True)),
                ('fecha_registro', models.DateTimeField(auto_now_add=True)),
                ('activa', models.BooleanField(default=True)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mascotas', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='agenda',
            name='mascota',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='agenda', to='api.mascota'),
        ),
        migrations.AddField(
            model_name='publicacion',
            name='mascotas_etiquetadas',
            field=models.ManyToManyField(blank=True, related_name='publicaciones_etiquetadas', to='api.mascota'),
        ),
        migrations.CreateModel(
            name='MascotaPerdida',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('especie', models.CharField(max_length=50)),
                ('raza', models.CharField(blank=True, max_length=100, null=True)),
                ('color', models.CharField(blank=True, max_length=100, null=True)),
                ('tamano', models.CharField(blank=True, max_length=50, null=True)),
                ('foto', models.URLField(blank=True, null=True)),
                ('fecha_perdida', models.DateTimeField()),
                ('lugar_perdida', models.CharField(max_length=200)),
                ('descripcion', models.TextField()),
                ('estado', models.CharField(choices=[('perdida', 'Perdida'), ('encontrada', 'Encontrada'), ('devuelta', 'Devuelta a su dueño')], default='perdida', max_length=20)),
                ('telefono_contacto', models.CharField(blank=True, max_length=20, null=True)),
                ('email_contacto', models.EmailField(blank=True, max_length=254, null=True)),
                ('latitud', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ('longitud', models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True)),
                ('direccion_aproximada', models.TextField(blank=True, null=True)),
                ('recompensa', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('caracteristicas_especiales', models.TextField(blank=True, null=True)),
                ('fecha_publicacion', models.DateTimeField(auto_now_add=True)),
                ('fecha_encontrada', models.DateTimeField(blank=True, null=True)),
                ('mascota', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='eventos_perdida', to='api.mascota')),
                ('publicacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mascotas_perdidas', to='api.publicacion')),
            ],
            options={
                'ordering': ['-fecha_publicacion'],
            },
        ),
        migrations.CreateModel(
            name='ProcesoAdopcion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estado', models.CharField(choices=[('solicitud', 'Solicitud Enviada'), ('revisando', 'En Revisión'), ('aceptada', 'Solicitud Aceptada'), ('rechazada', 'Solicitud Rechazada'), ('completada', 'Adopción Completada'), ('cancelada', 'Proceso Cancelado')], default='solicitud', max_length=20)),
                ('motivo_adopcion', models.TextField()),
                ('experiencia_mascotas', models.TextField(blank=True, null=True)),
                ('tiempo_disponible', models.CharField(blank=True, max_length=100, null=True)),
                ('vivienda_adecuada', models.BooleanField(default=False)),
                ('otros_mascotas', models.BooleanField(default=False)),
                ('descripcion_otros_mascotas', models.TextField(blank=True, null=True)),
                ('telefono_solicitante', models.CharField(blank=True, max_length=20, null=True)),
                ('direccion_solicitante', models.TextField(blank=True, null=True)),
                ('fecha_solicitud', models.DateTimeField(auto_now_add=True)),
                ('fecha_resolucion', models.DateTimeField(blank=True, null=True)),
                ('fecha_completado', models.DateTimeField(blank=True, null=True)),
                ('comentarios_propietario', models.TextField(blank=True, null=True)),
                ('comentarios_solicitante', models.TextField(blank=True, null=True)),
                ('mascota', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='procesos_adopcion', to='api.mascota')),
                ('propietario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mascotas_en_adopcion', to=settings.AUTH_USER_MODEL)),
                ('publicacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='procesos_adopcion', to='api.publicacion')),
                ('solicitante', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='solicitudes_adopcion', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-fecha_solicitud'],
            },
        ),
        migrations.CreateModel(
            name='Reaccion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo_reaccion', models.CharField(choices=[('me_gusta', 'Me gusta'), ('me_encanta', 'Me encanta'), ('me_divierte', 'Me divierte'), ('me_asombra', 'Me asombra'), ('me_entristece', 'Me entristece')], default='me_gusta', max_length=20)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('publicacion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reacciones', to='api.publicacion')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reacciones_dadas', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-fecha_creacion'],
                'unique_together': {('publicacion', 'usuario')},
            },
        ),
    ]
