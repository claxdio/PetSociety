from django.contrib import admin
from .models import Publicacion, Perfil

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
    list_display = ['usuario', 'descripcion_corta', 'fecha_creacion']
    list_filter = ['fecha_creacion']
    search_fields = ['usuario__username', 'descripcion']
    readonly_fields = ['fecha_creacion']
    
    def descripcion_corta(self, obj):
        return obj.descripcion[:50] + '...' if len(obj.descripcion) > 50 else obj.descripcion
    descripcion_corta.short_description = 'Descripción'