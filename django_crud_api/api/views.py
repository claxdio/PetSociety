from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (Reporte)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, PerfilSerializer,
    PublicacionSerializer, CustomTokenObtainPairSerializer, ReporteSerializer,
    MascotaSerializer, AgendaSerializer, EventoAgendaSerializer,
    ProcesoAdopcionSerializer, MascotaPerdidaSerializer, CategoriaSerializer
)
from .models import Publicacion, Perfil, Mascota, Agenda, EventoAgenda, ProcesoAdopcion, MascotaPerdida, ArchivoPublicacion, Reaccion, Comentario, Categoria, Reporte
from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Publicacion
from .serializers import PublicacionSerializer

class PublicacionFiltradaView(APIView):
    def get(self, request):
        publicaciones = Publicacion.objects.all()

        q = request.GET.get("q")
        tipo_publicacion = request.GET.getlist("tipo_publicacion")

        if q:
            if q.startswith("#"):
                publicaciones = publicaciones.filter(categorias__nombre__icontains=q[1:])
            else:
                publicaciones = publicaciones.filter(
                    Q(usuario__nombre__icontains=q) |
                    Q(descripcion__icontains=q)
                )

        if tipo_publicacion:
            publicaciones = publicaciones.filter(tipo_publicacion__in=tipo_publicacion)

        serializer = PublicacionSerializer(publicaciones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReporteCreateView(generics.CreateAPIView):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        publicacion_id = request.data.get('publicacion_reportada')
        user = request.user

        from .models import Publicacion, Reporte  # ajusta import si es necesario

        try:
            publicacion = Publicacion.objects.get(id=publicacion_id)
        except Publicacion.DoesNotExist:
            return Response({"detail": "La publicación no existe."}, status=status.HTTP_400_BAD_REQUEST)

        # Si el usuario reporta su propia publicación, eliminarla
        if publicacion.usuario == user:
            publicacion.delete()
            return Response({"detail": "Has eliminado tu propia publicación por autorreporte."}, status=status.HTTP_200_OK)

        # Sino, continuar con creación del reporte
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class PublicacionListCreateView(generics.ListCreateAPIView):
    serializer_class = PublicacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Publicacion.objects.all() #type: ignore

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

class PerfilDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = PerfilSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.perfil
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserMascotaListView(generics.ListAPIView):
    serializer_class = MascotaSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """
        Esta vista devuelve una lista de todas las mascotas de un usuario dado por su username.
        """
        username = self.kwargs['username']
        return Mascota.objects.filter(usuario__username=username)

class MascotaListCreateView(generics.ListCreateAPIView):
    serializer_class = MascotaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Mascota.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class MascotaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MascotaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Mascota.objects.filter(usuario=self.request.user)

class AgendaDetailView(generics.RetrieveAPIView):
    serializer_class = AgendaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Agenda.objects.filter(mascota__usuario=self.request.user)

class EventoAgendaListCreateView(generics.ListCreateAPIView):
    serializer_class = EventoAgendaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EventoAgenda.objects.filter(agenda__mascota__usuario=self.request.user)

    def perform_create(self, serializer):
        # Obtener la agenda de la mascota
        mascota_id = self.request.data.get('mascota_id')
        try:
            mascota = Mascota.objects.get(id=mascota_id, usuario=self.request.user)
            agenda = mascota.agenda
            serializer.save(agenda=agenda)
        except Mascota.DoesNotExist:
            raise serializers.ValidationError("Mascota no encontrada o no tienes permisos.")

class EventoAgendaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventoAgendaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return EventoAgenda.objects.filter(agenda__mascota__usuario=self.request.user)

class ProcesoAdopcionListCreateView(generics.ListCreateAPIView):
    serializer_class = ProcesoAdopcionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProcesoAdopcion.objects.filter(solicitante=self.request.user)

    def perform_create(self, serializer):
        # Verificar que la publicación es de tipo adopción
        publicacion = serializer.validated_data['publicacion']
        if publicacion.tipo_publicacion != 'adopcion':
            raise serializers.ValidationError("Solo se pueden crear solicitudes para publicaciones de adopción.")
        
        # Verificar que no es el propietario de la mascota
        mascota = serializer.validated_data['mascota']
        if mascota.usuario == self.request.user:
            raise serializers.ValidationError("No puedes solicitar adoptar tu propia mascota.")
        
        serializer.save(solicitante=self.request.user, propietario=mascota.usuario)

class ProcesoAdopcionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProcesoAdopcionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # El usuario puede ver sus solicitudes o las solicitudes de sus mascotas
        return ProcesoAdopcion.objects.filter(
            models.Q(solicitante=self.request.user) | 
            models.Q(propietario=self.request.user)
        )

class MascotaPerdidaListCreateView(generics.ListCreateAPIView):
    serializer_class = MascotaPerdidaSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]  # Público
        return [IsAuthenticated()]  # Crear requiere autenticación

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return MascotaPerdida.objects.filter(publicacion__usuario=self.request.user)
        return MascotaPerdida.objects.all()

    def perform_create(self, serializer):
        # Verificar que la publicación es de tipo mascota perdida
        publicacion = serializer.validated_data['publicacion']
        if publicacion.tipo_publicacion != 'mascota_perdida':
            raise serializers.ValidationError("Solo se pueden crear registros de mascota perdida para publicaciones de tipo mascota perdida.")
        
        serializer.save()

class MascotaPerdidaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MascotaPerdidaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MascotaPerdida.objects.filter(publicacion__usuario=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    """Obtener información del usuario autenticado"""
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'is_admin': user.is_staff or user.is_superuser,
        'last_login': user.last_login,
        'is_active': user.is_active,
        'date_joined': user.date_joined,
        'perfil': PerfilSerializer(user.perfil).data
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """Verificar credenciales de administrador"""
    username_or_email = request.data.get('username')
    password = request.data.get('password')
    
    if not username_or_email or not password:
        return Response(
            {'error': 'Se requieren usuario/correo y contraseña'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Buscar usuario por username o email
    user = None
    if User.objects.filter(username=username_or_email).exists():
        user = authenticate(username=username_or_email, password=password)
    elif User.objects.filter(email=username_or_email).exists():
        user_obj = User.objects.get(email=username_or_email)
        user = authenticate(username=user_obj.username, password=password)
    
    if user is None:
        return Response(
            {'error': 'Credenciales inválidas'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Verificar si es administrador
    if not (user.is_staff or user.is_superuser):
        return Response(
            {'error': 'Acceso denegado. Solo administradores pueden acceder.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Verificar si la cuenta está activa
    if not user.is_active:
        return Response(
            {'error': 'Cuenta desactivada.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Verificar si el perfil está activo
    if hasattr(user, 'perfil') and not user.perfil.cuenta_activa:
        return Response(
            {'error': 'Cuenta bloqueada por administrador.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Generar tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'is_admin': True,
            'last_login': user.last_login,
            'is_active': user.is_active,
            'perfil': PerfilSerializer(user.perfil).data
        }
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_archivo_publicacion(request, publicacion_id):
    """Subir archivos a una publicación específica"""
    try:
        publicacion = Publicacion.objects.get(id=publicacion_id, usuario=request.user)
    except Publicacion.DoesNotExist:
        return Response(
            {'error': 'Publicación no encontrada o no tienes permisos'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    archivo = request.FILES.get('archivo')
    if not archivo:
        return Response(
            {'error': 'No se proporcionó ningún archivo'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Determinar tipo de archivo basado en la extensión
    extension = archivo.name.lower().split('.')[-1]
    tipo_archivo = 'imagen' if extension in ['jpg', 'jpeg', 'png', 'gif', 'webp'] else 'video' if extension in ['mp4', 'mov', 'avi'] else 'otro'
    
    # Crear el registro de archivo
    archivo_publicacion = ArchivoPublicacion.objects.create(
        publicacion=publicacion,
        tipo_archivo=tipo_archivo,
        ruta_archivo=archivo
    )
    
    return Response({
        'message': 'Archivo subido exitosamente',
        'archivo_id': archivo_publicacion.id,
        'url': request.build_absolute_uri(archivo_publicacion.ruta_archivo.url)
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_foto_perfil(request):
    """Subir foto de perfil del usuario"""
    foto = request.FILES.get('foto_perfil')
    if not foto:
        return Response(
            {'error': 'No se proporcionó ningún archivo'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Actualizar el perfil del usuario
    perfil = request.user.perfil
    perfil.foto_perfil = foto
    perfil.save()
    
    return Response({
        'message': 'Foto de perfil actualizada exitosamente',
        'foto_url': request.build_absolute_uri(perfil.foto_perfil.url)
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, publicacion_id):
    """Toggle like en una publicación (dar o quitar me gusta)"""
    try:
        publicacion = Publicacion.objects.get(id=publicacion_id)
    except Publicacion.DoesNotExist:
        return Response(
            {'error': 'Publicación no encontrada'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Verificar si ya tiene like
    reaccion_existente = Reaccion.objects.filter(
        publicacion=publicacion, 
        usuario=request.user, 
        tipo_reaccion='me_gusta'
    ).first()
    
    if reaccion_existente:
        # Si ya tiene like, quitarlo
        reaccion_existente.delete()
        liked = False
    else:
        # Si no tiene like, agregarlo
        Reaccion.objects.create(
            publicacion=publicacion,
            usuario=request.user,
            tipo_reaccion='me_gusta'
        )
        liked = True
    
    # Contar likes totales
    total_likes = publicacion.reacciones.count()
    
    return Response({
        'liked': liked,
        'total_likes': total_likes,
        'message': 'Like agregado' if liked else 'Like removido'
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def agregar_comentario(request, publicacion_id):
    """Agregar un comentario a una publicación"""
    try:
        publicacion = Publicacion.objects.get(id=publicacion_id)
    except Publicacion.DoesNotExist:
        return Response(
            {'error': 'Publicación no encontrada'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    contenido = request.data.get('contenido', '').strip()
    if not contenido:
        return Response(
            {'error': 'El comentario no puede estar vacío'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Crear el comentario
    comentario = Comentario.objects.create(
        publicacion=publicacion,
        usuario=request.user,
        contenido=contenido
    )
    
    # Serializar el comentario recién creado
    from .serializers import ComentarioSerializer
    comentario_serializer = ComentarioSerializer(comentario, context={'request': request})
    
    return Response({
        'comentario': comentario_serializer.data,
        'total_comentarios': publicacion.comentarios.count(),
        'message': 'Comentario agregado exitosamente'
    }, status=status.HTTP_201_CREATED)

class CategoriaListCreateView(generics.ListCreateAPIView):
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]
    queryset = Categoria.objects.all()