from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.utils import timezone

# Create your models here.

class Perfil(models.Model):
    TIPO_USUARIO_CHOICES = [
        ('normal', 'Normal'),
        ('organizacion', 'Organización'),
        ('veterinario', 'Veterinario'),
    ]
    # Relación uno a uno con User de Django
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')

    # Campos del perfil
    nombre = models.CharField(max_length=100, blank=True)
    apellido = models.CharField(max_length=100, blank=True)
    direccion = models.TextField(blank=True, null=True)
    foto_perfil = models.URLField(blank=True, null=True)
    biografia = models.TextField(blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    # Campos adicionales del usuario
    tipo_usuario = models.CharField(
        max_length=20, 
        choices=TIPO_USUARIO_CHOICES, 
        default='normal'
    )
    cuenta_activa = models.BooleanField(default=True) #type: ignore
    
    def __str__(self):
        return f"Perfil de {self.usuario.username}" #type: ignore
    
    @property
    def nombre_completo(self):
        return f"{self.nombre} {self.apellido}".strip()

class Categoria(models.Model):
    """Categorías para las publicaciones (ej. #consejos, #gracioso)"""
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categorías"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Publicacion(models.Model):
    TIPO_PUBLICACION_CHOICES = [
        ('general', 'General'),
        ('adopcion', 'Adopción'),
        ('mascota_perdida', 'Mascota Perdida'),
        ('otro', 'Otro'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='publicaciones')
    descripcion = models.TextField()
    # El campo 'imagen' se elimina, ahora se gestiona con ArchivoPublicacion
    foto_usuario = models.URLField(blank=True, null=True) 
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    # Relaciones Many-to-Many
    mascotas_etiquetadas = models.ManyToManyField('Mascota', related_name='publicaciones_etiquetadas', blank=True)
    categorias = models.ManyToManyField(Categoria, related_name='publicaciones', blank=True)

    # Nuevo campo para tipo de publicación
    tipo_publicacion = models.CharField(
        max_length=20,
        choices=TIPO_PUBLICACION_CHOICES,
        default='general'
    )

    class Meta:
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.usuario.username}: {self.descripcion[:20]}" #type: ignore

class ArchivoPublicacion(models.Model):
    """Archivos multimedia asociados a una publicación"""
    TIPO_ARCHIVO_CHOICES = [
        ('imagen', 'Imagen'),
        ('video', 'Video'),
        ('gif', 'GIF'),
        ('otro', 'Otro'),
    ]

    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, related_name='archivos')
    tipo_archivo = models.CharField(max_length=10, choices=TIPO_ARCHIVO_CHOICES, default='imagen')
    ruta_archivo = models.URLField(max_length=500) # Usamos URLField para consistencia
    fecha_subida = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['fecha_subida']

    def __str__(self):
        return f"Archivo de {self.publicacion.id} - {self.tipo_archivo}"


class Comentario(models.Model):
    """Comentarios realizados por usuarios en una publicación"""
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, related_name='comentarios')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comentarios_realizados')
    contenido = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    es_oculto = models.BooleanField(default=False)

    class Meta:
        ordering = ['fecha_creacion']

    def __str__(self):
        return f"Comentario de {self.usuario.username} en la publicación {self.publicacion.id}"

class Reaccion(models.Model):
    """Reacciones (likes) de los usuarios a una publicación"""
    TIPO_REACCION_CHOICES = [
        ('me_gusta', 'Me gusta'),
        ('me_encanta', 'Me encanta'),
        ('me_divierte', 'Me divierte'),
        ('me_asombra', 'Me asombra'),
        ('me_entristece', 'Me entristece'),
    ]

    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, related_name='reacciones')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reacciones_dadas')
    tipo_reaccion = models.CharField(max_length=20, choices=TIPO_REACCION_CHOICES, default='me_gusta')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Un usuario solo puede dar una reacción por publicación
        unique_together = ('publicacion', 'usuario')
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.usuario.username} reaccionó con \"{self.get_tipo_reaccion_display()}\" a la publicación {self.publicacion.id}"

class Mascota(models.Model):
    # Relación con Usuario (Django) - Usuario registra Mascotas
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mascotas')

    # Atributos según diagrama E-R
    nombre = models.CharField(max_length=100)
    especie = models.CharField(max_length=50)
    foto = models.URLField(blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)

    # Campos adicionales útiles para la lógica
    fecha_registro = models.DateTimeField(auto_now_add=True)
    activa = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre} ({self.especie}) - {self.usuario.username}"

class Agenda(models.Model):
    """Agenda/Calendario personal de una mascota"""
    # Relación con Mascota - Una mascota tiene una agenda (1:1)
    mascota = models.OneToOneField(Mascota, on_delete=models.CASCADE, related_name='agenda')
    
    # Información de la agenda
    titulo = models.CharField(max_length=200, default="Agenda de cuidados")
    descripcion = models.TextField(blank=True, null=True)
    
    # Campos de auditoría
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Agenda de {self.mascota.nombre}"
    
    @property
    def eventos_proximos(self):
        """Obtiene eventos próximos (próximos 7 días)"""
        from django.utils import timezone
        from datetime import timedelta
        ahora = timezone.now()
        proxima_semana = ahora + timedelta(days=7)
        return self.eventos.filter(
            fecha_evento__gte=ahora,
            fecha_evento__lte=proxima_semana,
            estado='pendiente'
        ).order_by('fecha_evento')
    
    @property
    def eventos_pasados(self):
        """Obtiene eventos pasados"""
        from django.utils import timezone
        return self.eventos.filter(
            fecha_evento__lt=timezone.now()
        ).order_by('-fecha_evento')

class EventoAgenda(models.Model):
    """Eventos individuales dentro de una agenda"""
    TIPO_EVENTO_CHOICES = [
        ('vacuna', 'Vacuna'),
        ('veterinario', 'Visita Veterinario'),
        ('desparasitacion', 'Desparasitación'),
        ('peluqueria', 'Peluquería'),
        ('revision', 'Revisión General'),
        ('cuidado', 'Cuidado Especial'),
        ('otro', 'Otro'),
    ]
    
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada'),
    ]
    
    # Relación con Agenda - Una agenda puede tener múltiples eventos
    agenda = models.ForeignKey(Agenda, on_delete=models.CASCADE, related_name='eventos')
    
    # Campos principales del evento
    tipo_evento = models.CharField(max_length=20, choices=TIPO_EVENTO_CHOICES)
    motivo = models.CharField(max_length=200)  # Descripción específica del evento
    fecha_evento = models.DateTimeField()
    
    # Información adicional
    veterinario = models.CharField(max_length=100, blank=True, null=True)
    lugar = models.CharField(max_length=200, blank=True, null=True)
    costo = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
    # Estado y seguimiento
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    fecha_completado = models.DateTimeField(blank=True, null=True)
    notas_completado = models.TextField(blank=True, null=True)
    
    # Campos de auditoría
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['fecha_evento']
    
    def __str__(self):
        return f"{self.agenda.mascota.nombre} - {self.get_tipo_evento_display()}: {self.motivo}"
    
    @property
    def es_pasado(self):
        """Verifica si el evento ya pasó"""
        from django.utils import timezone
        return self.fecha_evento < timezone.now()
    
    @property
    def es_proximo(self):
        """Verifica si el evento es en los próximos 7 días"""
        from django.utils import timezone
        from datetime import timedelta
        ahora = timezone.now()
        proxima_semana = ahora + timedelta(days=7)
        return ahora <= self.fecha_evento <= proxima_semana

class ProcesoAdopcion(models.Model):
    """Proceso de adopción relacionado con publicaciones y mascotas"""
    ESTADO_CHOICES = [
        ('solicitud', 'Solicitud Enviada'),
        ('revisando', 'En Revisión'),
        ('aceptada', 'Solicitud Aceptada'),
        ('rechazada', 'Solicitud Rechazada'),
        ('completada', 'Adopción Completada'),
        ('cancelada', 'Proceso Cancelado'),
    ]
    
    # Relaciones principales
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, related_name='procesos_adopcion')
    mascota = models.ForeignKey(Mascota, on_delete=models.CASCADE, related_name='procesos_adopcion')
    
    # Usuarios involucrados
    solicitante = models.ForeignKey(User, on_delete=models.CASCADE, related_name='solicitudes_adopcion')
    propietario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mascotas_en_adopcion')
    
    # Información de la solicitud
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='solicitud')
    motivo_adopcion = models.TextField()
    experiencia_mascotas = models.TextField(blank=True, null=True)
    tiempo_disponible = models.CharField(max_length=100, blank=True, null=True)
    vivienda_adecuada = models.BooleanField(default=False)
    otros_mascotas = models.BooleanField(default=False)
    descripcion_otros_mascotas = models.TextField(blank=True, null=True)
    
    # Información de contacto del solicitante
    telefono_solicitante = models.CharField(max_length=20, blank=True, null=True)
    direccion_solicitante = models.TextField(blank=True, null=True)
    
    # Fechas del proceso
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    fecha_resolucion = models.DateTimeField(blank=True, null=True)
    fecha_completado = models.DateTimeField(blank=True, null=True)
    
    # Comentarios y notas
    comentarios_propietario = models.TextField(blank=True, null=True)
    comentarios_solicitante = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-fecha_solicitud']
    
    def __str__(self):
        return f"Adopción de {self.mascota.nombre} - {self.get_estado_display()}"
    
    @property
    def es_activo(self):
        """Verifica si el proceso está activo"""
        return self.estado in ['solicitud', 'revisando']

class MascotaPerdida(models.Model):
    """Mascota perdida relacionada con publicaciones y localización"""
    ESTADO_CHOICES = [
        ('perdida', 'Perdida'),
        ('encontrada', 'Encontrada'),
        ('devuelta', 'Devuelta a su dueño'),
    ]
    
    # Relaciones principales
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, related_name='mascotas_perdidas')
    mascota = models.ForeignKey(Mascota, on_delete=models.CASCADE, related_name='eventos_perdida', blank=True, null=True)
    
    # Información de la mascota perdida
    nombre = models.CharField(max_length=100)
    especie = models.CharField(max_length=50)
    raza = models.CharField(max_length=100, blank=True, null=True)
    color = models.CharField(max_length=100, blank=True, null=True)
    tamano = models.CharField(max_length=50, blank=True, null=True)
    foto = models.URLField(blank=True, null=True)
    
    # Información del evento de pérdida
    fecha_perdida = models.DateTimeField()
    lugar_perdida = models.CharField(max_length=200)
    descripcion = models.TextField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='perdida')
    
    # Información de contacto
    telefono_contacto = models.CharField(max_length=20, blank=True, null=True)
    email_contacto = models.EmailField(blank=True, null=True)
    
    # Información de localización para el mapa
    latitud = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitud = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    direccion_aproximada = models.TextField(blank=True, null=True)
    
    # Información adicional
    caracteristicas_especiales = models.TextField(blank=True, null=True)
    
    # Fechas
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    fecha_encontrada = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-fecha_publicacion']
    
    def __str__(self):
        return f"{self.nombre} - {self.get_estado_display()} - {self.lugar_perdida}"
    
    @property
    def coordenadas_validas(self):
        """Verifica si tiene coordenadas válidas para el mapa"""
        return self.latitud is not None and self.longitud is not None
    
    @property
    def es_activa(self):
        """Verifica si la búsqueda está activa"""
        return self.estado == 'perdida'

class Sancion(models.Model):
    """Sistema de sanciones aplicadas por moderadores a usuarios."""
    TIPO_SANCION_CHOICES = [
        ('advertencia', 'Advertencia'),
        ('suspension_temporal', 'Suspensión Temporal'),
        ('suspension_permanente', 'Suspensión Permanente'),
        ('baneo', 'Baneo de la Plataforma'),
    ]

    # Relaciones
    moderador = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='sanciones_aplicadas',
        limit_choices_to={'is_staff': True}
    )
    usuario_sancionado = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='sanciones_recibidas'
    )

    # Atributos de la sanción
    tipo_sancion = models.CharField(max_length=30, choices=TIPO_SANCION_CHOICES)
    motivo = models.TextField()
    fecha_sancion = models.DateTimeField(auto_now_add=True)
    fecha_termino = models.DateTimeField(
        blank=True, 
        null=True, 
        help_text="Si la suspensión es temporal, indicar hasta cuándo."
    )
    
    # Estado de la sanción
    activa = models.BooleanField(default=True)

    def __str__(self):
        return f"Sanción a {self.usuario_sancionado.username} por {self.moderador.username}"

    def clean(self):
        # Validar que un moderador no se sancione a sí mismo
        if self.moderador == self.usuario_sancionado:
            raise ValidationError("Un moderador no puede sancionarse a sí mismo.")
        
        # Validar que la fecha de término sea obligatoria para suspensiones temporales
        if self.tipo_sancion == 'suspension_temporal' and not self.fecha_termino:
            raise ValidationError("La fecha de término es obligatoria para una suspensión temporal.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    @property
    def es_permanente(self):
        return self.tipo_sancion in ['suspension_permanente', 'baneo']

    @property
    def duracion(self):
        if self.tipo_sancion == 'suspension_temporal' and self.fecha_termino:
            return self.fecha_termino - self.fecha_sancion
        return None

class Reporte(models.Model):
    """Reportes de publicaciones hechos por usuarios."""
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('revisando', 'En Revisión'),
        ('resuelto', 'Resuelto'),
        ('desestimado', 'Desestimado'),
    ]

    # Relaciones
    publicacion_reportada = models.ForeignKey(Publicacion, on_delete=models.CASCADE, related_name='reportes')
    usuario_reportante = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reportes_realizados')
    moderador_asignado = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        related_name='reportes_asignados',
        null=True, 
        blank=True,
        limit_choices_to={'is_staff': True}
    )

    # Atributos del reporte
    motivo = models.TextField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    fecha_reporte = models.DateTimeField(auto_now_add=True)
    fecha_resolucion = models.DateTimeField(blank=True, null=True)
    notas_moderador = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-fecha_reporte']
        unique_together = ('publicacion_reportada', 'usuario_reportante') # Un usuario solo puede reportar una publicación una vez

    def __str__(self):
        return f"Reporte de {self.usuario_reportante.username} sobre la publicación {self.publicacion_reportada.id}"

    def clean(self):
        # Validar que un usuario no reporte su propia publicación
        if self.publicacion_reportada.usuario == self.usuario_reportante:
            raise ValidationError("No puedes reportar tu propia publicación.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

class ForoPyR(models.Model):
    """Modelo unificado para Preguntas y Respuestas del foro."""
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entradas_foro')
    contenido = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    # Relación reflexiva para respuestas
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='respuestas'
    )

    # Atributos específicos para preguntas
    titulo = models.CharField(max_length=200, null=True, blank=True)
    resuelta = models.BooleanField(default=False)

    # Atributo específico para respuestas
    es_mejor_respuesta = models.BooleanField(default=False)

    class Meta:
        ordering = ['fecha_creacion']

    def __str__(self):
        if self.parent:
            return f"Respuesta de {self.usuario.username} a la pregunta #{self.parent.id}"
        return f"Pregunta de {self.usuario.username}: {self.titulo}"

    @property
    def es_pregunta(self):
        return self.parent is None

    @property
    def es_respuesta(self):
        return self.parent is not None

class Establecimiento(models.Model):
    """Establecimientos relacionados con mascotas (veterinarias, tiendas, etc.)."""
    TIPO_ESTABLECIMIENTO_CHOICES = [
        ('veterinaria', 'Veterinaria'),
        ('tienda_mascotas', 'Tienda de Mascotas'),
        ('peluqueria_canina', 'Peluquería Canina'),
        ('hotel_mascotas', 'Hotel de Mascotas'),
        ('parque', 'Parque para Mascotas'),
        ('otro', 'Otro'),
    ]

    # Relaciones
    propietario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='establecimientos_registrados')

    # Información básica
    nombre = models.CharField(max_length=200)
    tipo_establecimiento = models.CharField(max_length=50, choices=TIPO_ESTABLECIMIENTO_CHOICES)
    descripcion = models.TextField()
    imagen_principal = models.URLField(max_length=500, blank=True, null=True)

    # Contacto y ubicación
    direccion = models.TextField()
    telefono = models.CharField(max_length=20, blank=True, null=True)
    horario = models.TextField(blank=True, null=True)
    sitio_web = models.URLField(blank=True, null=True)

    # Coordenadas para el mapa
    latitud = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitud = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)

    # Estado
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Resena(models.Model):
    """Reseñas y calificaciones de los usuarios para los establecimientos."""
    CALIFICACION_CHOICES = [
        (1, '1 - Muy Malo'),
        (2, '2 - Malo'),
        (3, '3 - Regular'),
        (4, '4 - Bueno'),
        (5, '5 - Excelente'),
    ]

    # Relaciones
    establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE, related_name='resenas')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resenas_realizadas')

    # Contenido de la reseña
    calificacion = models.IntegerField(choices=CALIFICACION_CHOICES)
    titulo = models.CharField(max_length=100)
    contenido = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha_creacion']
        unique_together = ('establecimiento', 'usuario') # Un usuario solo puede dejar una reseña por establecimiento

    def __str__(self):
        return f"Reseña de {self.usuario.username} para {self.establecimiento.nombre}"

# Señal para crear perfil automáticamente cuando se crea un usuario
@receiver(post_save, sender=User)
def crear_perfil_usuario(sender, instance, created, **kwargs):
    if created:
        Perfil.objects.create(usuario=instance) #type: ignore

@receiver(post_save, sender=User)
def guardar_perfil_usuario(sender, instance, **kwargs):
    if hasattr(instance, 'perfil'):
        instance.perfil.save()

# Señal para crear agenda automáticamente cuando se crea una mascota
@receiver(post_save, sender=Mascota)
def crear_agenda_mascota(sender, instance, created, **kwargs):
    if created:
        Agenda.objects.create(mascota=instance)
