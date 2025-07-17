from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Publicacion(models.Model):
    usuario = models.CharField(max_length=100)
    descripcion = models.TextField()
    imagen = models.URLField(blank=True, null=True)  # o ImageField si usas media
    foto_usuario = models.URLField(blank=True, null=True)
    comentarios = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.usuario}: {self.descripcion[:20]}" #type: ignore