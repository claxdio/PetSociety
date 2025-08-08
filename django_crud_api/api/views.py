from rest_framework.views import APIView
from rest_framework import generics, status, serializers, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q
from django.core.exceptions import ValidationError as DjangoValidationError
from django.shortcuts import render
from django.contrib.auth.models import User
from django_filters import rest_framework as filters

from .serializers import (
    UserSerializer, UserRegistrationSerializer, PerfilSerializer,
    PublicacionSerializer, CustomTokenObtainPairSerializer, ReporteSerializer,
    MascotaSerializer, AgendaSerializer, EventoAgendaSerializer, ForoPyRSerializer,
    ProcesoAdopcionSerializer, MascotaPerdidaSerializer, CategoriaSerializer,
    AdminUserSerializer, AdminReporteSerializer, SancionSerializer, PublicacionDeleteSerializer
)
from .models import (Publicacion, Perfil, Mascota, Agenda, EventoAgenda, ProcesoAdopcion,
    MascotaPerdida, ArchivoPublicacion, Reaccion, Comentario, Categoria, Reporte, ForoPyR, Sancion, VotoForo)

from rest_framework.generics import RetrieveAPIView

class ForoPyRListCreateView(generics.ListCreateAPIView):
    queryset = ForoPyR.objects.all()
    serializer_class = ForoPyRSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ForoPyR.objects.all()
        tipo = self.request.query_params.get('tipo')  # 'pregunta' o 'respuesta'

        if tipo == 'pregunta':
            queryset = queryset.filter(parent__isnull=True)
        elif tipo == 'respuesta':
            queryset = queryset.filter(parent__isnull=False)

        return queryset

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class ForoPyRDeleteView(generics.DestroyAPIView):
    queryset = ForoPyR.objects.all()
    serializer_class = ForoPyRSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.usuario != request.user and not request.user.is_staff:
            return Response({"detail": "No tienes permiso para eliminar esta entrada."}, status=status.HTTP_403_FORBIDDEN)
        return super().delete(request, *args, **kwargs)

class ForoPyRDetailView(RetrieveAPIView):
    queryset = ForoPyR.objects.all()
    serializer_class = ForoPyRSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]

class ReporteListCreateDestroyView(generics.ListCreateAPIView, generics.DestroyAPIView):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario_reportante=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(usuario_reportante=self.request.user)

class PublicacionFiltradaView(filters.FilterSet):
    usuario = filters.CharFilter(field_name='usuario__username', lookup_expr='iexact')
    tipo = filters.ChoiceFilter(
        field_name='tipo_publicacion',
        choices=Publicacion.TIPO_PUBLICACION_CHOICES
    )
    categoria = filters.CharFilter(field_name='categorias__nombre', lookup_expr='iexact')

    class Meta:
        model = Publicacion
        fields = ['usuario', 'tipo', 'categoria']

class PublicacionListCreateView(generics.ListCreateAPIView):
    serializer_class = PublicacionSerializer
    permission_classes = [AllowAny]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = PublicacionFiltradaView

    def create(self, request, *args, **kwargs):
        print("Datos recibidos:", request.data)  # Verifica qué está llegando
        return super().create(request, *args, **kwargs)

    def get_queryset(self):
        queryset = Publicacion.objects.all()
        
        # Optimización de consultas
        return queryset.select_related('usuario').prefetch_related('categorias')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class PublicacionDestroyView(generics.DestroyAPIView):
    queryset = Publicacion.objects.all()
    serializer_class = PublicacionDeleteSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({"detail": "Esta ruta existe"}, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        print("Llegó petición DELETE")  # Verifica en la terminal de Django
        return super().delete(request, *args, **kwargs)

    def get_object(self):
        try:
            return Publicacion.objects.get(
                pk=self.kwargs['pk'],
                usuario=self.request.user  # Solo publicaciones del usuario
            )
        except Publicacion.DoesNotExist:
            return None

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance:
            return Response(
                {"detail": "Publicación no encontrada o no tienes permiso"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Elimina la publicación (se ejecutará el método delete sobrescrito)
        instance.delete()
        return Response(
            {"detail": "Publicación eliminada correctamente"},
            status=status.HTTP_200_OK
        )

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
    queryset = Mascota.objects.all()
    serializer_class = MascotaSerializer
    permission_classes = [IsAuthenticated]

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

class AdminUsersListView(generics.ListAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Verificar si es admin
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            return User.objects.none()
        return User.objects.all().order_by('-date_joined')

class AdminUserDetailView(generics.RetrieveAPIView):
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            return User.objects.none()
        return User.objects.all()

class AdminReportesListView(generics.ListAPIView):
    serializer_class = AdminReporteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            return Reporte.objects.none()
        return Reporte.objects.all().order_by('-fecha_reporte')

class AdminReporteDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = AdminReporteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            return Reporte.objects.none()
        return Reporte.objects.all()

class AdminSancionesListView(generics.ListAPIView):
    serializer_class = SancionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            return Sancion.objects.none()
        return Sancion.objects.all().order_by('-fecha_sancion')

def is_admin_user(user):
    return user and user.is_authenticated and (user.is_staff or user.is_superuser)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_apply_sanction(request):
    if not is_admin_user(request.user):
        return Response(
            {'error': 'Acceso denegado. Solo administradores.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    usuario_id = request.data.get('usuario_id')
    tipo_sancion = request.data.get('tipo_sancion')
    motivo = request.data.get('motivo')
    fecha_termino = request.data.get('fecha_termino')
    
    if not all([usuario_id, tipo_sancion, motivo]):
        return Response(
            {'error': 'Faltan campos requeridos: usuario_id, tipo_sancion, motivo'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        usuario = User.objects.get(id=usuario_id)
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    if usuario.is_staff or usuario.is_superuser:
        return Response(
            {'error': 'No se puede sancionar a un administrador'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    from datetime import datetime
    fecha_termino_parsed = None
    if fecha_termino:
        try:
            fecha_termino_parsed = datetime.fromisoformat(fecha_termino.replace('Z', '+00:00'))
        except ValueError:
            return Response(
                {'error': 'Formato de fecha inválido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    sancion = Sancion.objects.create(
        moderador=request.user,
        usuario_sancionado=usuario,
        tipo_sancion=tipo_sancion,
        motivo=motivo,
        fecha_termino=fecha_termino_parsed
    )
    
    if tipo_sancion in ['suspension_temporal', 'suspension_permanente', 'baneo']:
        usuario.perfil.cuenta_activa = False
        usuario.perfil.save()
    
    serializer = SancionSerializer(sancion)
    return Response({
        'message': 'Sanción aplicada exitosamente',
        'sancion': serializer.data
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_resolve_report(request, reporte_id):
    if not is_admin_user(request.user):
        return Response(
            {'error': 'Acceso denegado. Solo administradores.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    try:
        reporte = Reporte.objects.get(id=reporte_id)
    except Reporte.DoesNotExist:
        return Response(
            {'error': 'Reporte no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    accion = request.data.get('accion')
    notas = request.data.get('notas', '')
    
    if accion not in ['resuelto', 'desestimado']:
        return Response(
            {'error': 'Acción inválida. Use "resuelto" o "desestimado"'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    from django.utils import timezone
    reporte.estado = accion
    reporte.moderador_asignado = request.user
    reporte.fecha_resolucion = timezone.now()
    reporte.notas_moderador = notas
    reporte.save()
    
    # Serializar el reporte ANTES de eliminar la publicación
    serializer = AdminReporteSerializer(reporte)
    reporte_data = serializer.data
    
    eliminar_publicacion = request.data.get('eliminar_publicacion', False)
    mensaje_extra = ""
    if accion == 'resuelto' and eliminar_publicacion:
        try:
            reporte.publicacion_reportada.delete()
            mensaje_extra = " y publicación eliminada"
        except Exception as e:
            return Response({
                'error': f'Error al eliminar la publicación: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'message': f'Reporte {accion} exitosamente{mensaje_extra}',
        'reporte': reporte_data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_remove_sanction(request, sancion_id):
    if not is_admin_user(request.user):
        return Response(
            {'error': 'Acceso denegado. Solo administradores.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        sancion = Sancion.objects.get(id=sancion_id)
    except Sancion.DoesNotExist:
        return Response(
            {'error': 'Sanción no encontrada'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Reactivar la cuenta del usuario
    usuario = sancion.usuario_sancionado
    sancion.activa = False
    sancion.save()
    
    # Si era una suspensión/baneo, reactivar la cuenta
    if sancion.tipo_sancion in ['suspension_temporal', 'suspension_permanente', 'baneo']:
        # Verificar si no tiene otras sanciones activas que impliquen bloqueo
        otras_sanciones_activas = Sancion.objects.filter(
            usuario_sancionado=usuario,
            activa=True,
            tipo_sancion__in=['suspension_temporal', 'suspension_permanente', 'baneo']
        ).exists()
        
        if not otras_sanciones_activas:
            usuario.perfil.cuenta_activa = True
            usuario.perfil.save()
    
    return Response({
        'message': 'Sanción removida exitosamente',
        'usuario_reactivado': usuario.perfil.cuenta_activa
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    if not is_admin_user(request.user):
        return Response(
            {'error': 'Acceso denegado. Solo administradores.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    total_publications = Publicacion.objects.count()
    total_reports = Reporte.objects.count()
    pending_reports = Reporte.objects.filter(estado='pendiente').count()
    total_sanctions = Sancion.objects.filter(activa=True).count()
    
    return Response({
        'total_users': total_users,
        'active_users': active_users,
        'total_publications': total_publications,
        'total_reports': total_reports,
        'pending_reports': pending_reports,
        'total_sanctions': total_sanctions
    }, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_update_user_type(request, user_id):
    if not is_admin_user(request.user):
        return Response(
            {'error': 'Acceso denegado. Solo administradores.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {'error': 'Usuario no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    new_type = request.data.get('tipo_usuario')
    
    if new_type not in ['normal', 'veterinario', 'organizacion']:
        return Response(
            {'error': 'Tipo de usuario inválido. Debe ser: normal, veterinario u organizacion'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Actualizar el tipo de usuario en el perfil
    user.perfil.tipo_usuario = new_type
    user.perfil.save()
    
    serializer = AdminUserSerializer(user)
    return Response({
        'message': 'Tipo de usuario actualizado exitosamente',
        'user': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def votar_foro(request, entrada_id):
    """Votar en una entrada del foro (upvote/downvote)"""
    try:
        entrada = ForoPyR.objects.get(id=entrada_id)
    except ForoPyR.DoesNotExist:
        return Response(
            {'error': 'Entrada del foro no encontrada'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # No permitir que el usuario vote su propia entrada
    if entrada.usuario == request.user:
        return Response(
            {'error': 'No puedes votar tu propia publicación'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    tipo_voto = request.data.get('tipo_voto')  # 'up' o 'down'
    
    if tipo_voto not in ['up', 'down']:
        return Response(
            {'error': 'Tipo de voto inválido. Debe ser "up" o "down"'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    es_upvote = tipo_voto == 'up'
    
    # Verificar si ya existe un voto del usuario para esta entrada
    voto_existente = VotoForo.objects.filter(usuario=request.user, entrada_foro=entrada).first()
    
    if voto_existente:
        if voto_existente.es_upvote == es_upvote:
            # Si es el mismo tipo de voto, eliminar el voto (toggle)
            voto_existente.delete()
            user_vote = None
        else:
            # Si es diferente tipo de voto, actualizar
            voto_existente.es_upvote = es_upvote
            voto_existente.save()
            user_vote = tipo_voto
    else:
        # Crear nuevo voto
        VotoForo.objects.create(
            usuario=request.user,
            entrada_foro=entrada,
            es_upvote=es_upvote
        )
        user_vote = tipo_voto
    
    # Calcular totales actualizados
    total_votos = entrada.total_votos
    
    return Response({
        'total_votos': total_votos,
        'user_vote': user_vote,
        'message': 'Voto registrado exitosamente'
    }, status=status.HTTP_200_OK)