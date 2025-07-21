from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

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
    cuenta_activa = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Perfil de {self.usuario.username}"
    
    @property
    def nombre_completo(self):
        return f"{self.nombre} {self.apellido}".strip()

class Publicacion(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='publicaciones')
    descripcion = models.TextField()
    imagen = models.URLField(blank=True, null=True)
    foto_usuario = models.URLField(blank=True, null=True)
    comentarios = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"{self.usuario.username}: {self.descripcion[:20]}"

# Señal para crear perfil automáticamente cuando se crea un usuario
@receiver(post_save, sender=User)
def crear_perfil_usuario(sender, instance, created, **kwargs):
    if created:
        Perfil.objects.create(usuario=instance)

@receiver(post_save, sender=User)
def guardar_perfil_usuario(sender, instance, **kwargs):
    if hasattr(instance, 'perfil'):
        instance.perfil.save()