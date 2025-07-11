from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')

    def __str__(self):
        return self.title

class Publicacion(models.Model):
    usuario = models.CharField(max_length=100)
    descripcion = models.TextField()
    imagen = models.URLField(blank=True, null=True)  # o ImageField si usas media
    foto_usuario = models.URLField(blank=True, null=True)
    comentarios = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.usuario}: {self.descripcion[:20]}"