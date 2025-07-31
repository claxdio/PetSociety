from django.contrib import admin
from .models import Publicacion, Perfil, Mascota, Agenda, EventoAgenda, ProcesoAdopcion, MascotaPerdida

@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'nombre_completo', 'tipo_usuario', 'cuenta_activa', 'fecha_registro']
    list_filter = ['tipo_usuario', 'cuenta_activa', 'fecha_registro']
    search_fields = ['usuario__username', 'usuario__email', 'nombre', 'apellido']
    readonly_fields = ['fecha_registro']
    
    fieldsets = (
        ('Información del Usuario', {
            'fields': ('usuario', 'tipo_usuario', 'cuenta_activa')
        }),
        ('Información Personal', {
            'fields': ('nombre', 'apellido', 'direccion', 'biografia')
        }),
        ('Multimedia', {
            'fields': ('foto_perfil',)
        }),
        ('Fechas', {
            'fields': ('fecha_registro',),
            'classes': ('collapse',)
        }),
    )

@admin.register(Publicacion)
class PublicacionAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'tipo_publicacion', 'descripcion_corta', 'fecha_creacion']
    list_filter = ['tipo_publicacion', 'fecha_creacion']
    search_fields = ['usuario__username', 'descripcion']
    readonly_fields = ['fecha_creacion']
    
    def descripcion_corta(self, obj):
        return obj.descripcion[:50] + '...' if len(obj.descripcion) > 50 else obj.descripcion
    descripcion_corta.short_description = 'Descripción'

@admin.register(Mascota)
class MascotaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'especie', 'usuario', 'fecha_registro', 'activa']
    list_filter = ['especie', 'activa', 'fecha_registro']
    search_fields = ['nombre', 'usuario__username', 'especie']
    readonly_fields = ['fecha_registro']
    
    fieldsets = (
        ('Información de la Mascota', {
            'fields': ('nombre', 'especie', 'activa')
        }),
        ('Propietario', {
            'fields': ('usuario',)
        }),
        ('Información Adicional', {
            'fields': ('direccion', 'foto')
        }),
        ('Fechas', {
            'fields': ('fecha_registro',),
            'classes': ('collapse',)
        }),
    )

@admin.register(Agenda)
class AgendaAdmin(admin.ModelAdmin):
    list_display = ['mascota', 'titulo', 'fecha_creacion']
    list_filter = ['fecha_creacion']
    search_fields = ['mascota__nombre', 'titulo', 'descripcion']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion']
    
    fieldsets = (
        ('Información de la Agenda', {
            'fields': ('mascota', 'titulo', 'descripcion')
        }),
        ('Fechas de Auditoría', {
            'fields': ('fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )

@admin.register(EventoAgenda)
class EventoAgendaAdmin(admin.ModelAdmin):
    list_display = ['agenda', 'tipo_evento', 'motivo', 'fecha_evento', 'estado', 'veterinario']
    list_filter = ['tipo_evento', 'estado', 'fecha_evento', 'agenda__mascota__especie']
    search_fields = ['agenda__mascota__nombre', 'motivo', 'veterinario']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion']
    date_hierarchy = 'fecha_evento'
    
    fieldsets = (
        ('Información del Evento', {
            'fields': ('agenda', 'tipo_evento', 'motivo', 'fecha_evento')
        }),
        ('Detalles del Evento', {
            'fields': ('veterinario', 'lugar', 'costo')
        }),
        ('Estado y Seguimiento', {
            'fields': ('estado', 'fecha_completado', 'notas_completado')
        }),
        ('Fechas de Auditoría', {
            'fields': ('fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('agenda', 'agenda__mascota', 'agenda__mascota__usuario')

@admin.register(ProcesoAdopcion)
class ProcesoAdopcionAdmin(admin.ModelAdmin):
    list_display = ['mascota', 'solicitante', 'propietario', 'estado', 'fecha_solicitud']
    list_filter = ['estado', 'fecha_solicitud', 'fecha_resolucion']
    search_fields = ['mascota__nombre', 'solicitante__username', 'propietario__username', 'motivo_adopcion']
    readonly_fields = ['fecha_solicitud']
    date_hierarchy = 'fecha_solicitud'
    
    fieldsets = (
        ('Información del Proceso', {
            'fields': ('publicacion', 'mascota', 'solicitante', 'propietario', 'estado')
        }),
        ('Información de la Solicitud', {
            'fields': ('motivo_adopcion', 'experiencia_mascotas', 'tiempo_disponible', 'vivienda_adecuada')
        }),
        ('Información Adicional', {
            'fields': ('otros_mascotas', 'descripcion_otros_mascotas', 'telefono_solicitante', 'direccion_solicitante')
        }),
        ('Fechas del Proceso', {
            'fields': ('fecha_solicitud', 'fecha_resolucion', 'fecha_completado')
        }),
        ('Comentarios', {
            'fields': ('comentarios_propietario', 'comentarios_solicitante')
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('mascota', 'solicitante', 'propietario', 'publicacion')

@admin.register(MascotaPerdida)
class MascotaPerdidaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'especie', 'estado', 'lugar_perdida', 'fecha_perdida', 'fecha_publicacion']
    list_filter = ['estado', 'especie', 'fecha_perdida', 'fecha_publicacion']
    search_fields = ['nombre', 'lugar_perdida', 'descripcion', 'publicacion__usuario__username']
    readonly_fields = ['fecha_publicacion']
    date_hierarchy = 'fecha_perdida'
    
    fieldsets = (
        ('Información de la Mascota', {
            'fields': ('publicacion', 'mascota', 'nombre', 'especie', 'raza', 'color', 'tamano', 'foto')
        }),
        ('Información del Evento', {
            'fields': ('fecha_perdida', 'lugar_perdida', 'descripcion', 'estado')
        }),
        ('Información de Contacto', {
            'fields': ('telefono_contacto', 'email_contacto')
        }),
        ('Localización', {
            'fields': ('latitud', 'longitud', 'direccion_aproximada')
        }),
        ('Información Adicional', {
            'fields': ('caracteristicas_especiales',)
        }),
        ('Fechas', {
            'fields': ('fecha_publicacion', 'fecha_encontrada')
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('publicacion', 'publicacion__usuario', 'mascota')