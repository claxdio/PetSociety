from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    UserSerializer, UserRegistrationSerializer, PerfilSerializer, 
    PublicacionSerializer, CustomTokenObtainPairSerializer,
    MascotaSerializer, AgendaSerializer, EventoAgendaSerializer,
#deaqui*/
    ProcesoAdopcionSerializer, MascotaPerdidaSerializer, CitaMedicaSerializer
)
from .models import Publicacion, Perfil, Mascota, Agenda, EventoAgenda, ProcesoAdopcion, MascotaPerdida, CitaMedica
from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.core.exceptions import ValidationError
#aaaa aqui*/

class PublicacionListCreateView(generics.ListCreateAPIView):
    serializer_class = PublicacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Publicacion.objects.all() #type: ignore

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

class PerfilDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = PerfilSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user.perfil

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MascotaPerdida.objects.filter(publicacion__usuario=self.request.user)

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
#deaqui*/

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def citas_medicas_list(request):
    """Lista y crea citas médicas"""
    if request.method == 'GET':
        # Filtrar por mascota si se especifica
        mascota_id = request.query_params.get('mascota_id')
        if mascota_id:
            citas = CitaMedica.objects.filter(mascota_id=mascota_id, mascota__usuario=request.user)
        else:
            citas = CitaMedica.objects.filter(mascota__usuario=request.user)
        
        serializer = CitaMedicaSerializer(citas, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CitaMedicaSerializer(data=request.data)
        if serializer.is_valid():
            # Verificar que la mascota pertenece al usuario
            mascota = serializer.validated_data['mascota']
            if mascota.usuario != request.user:
                return Response(
                    {'error': 'No tienes permisos para crear citas para esta mascota.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def cita_medica_detail(request, pk):
    """Obtiene, actualiza o elimina una cita médica específica"""
    cita = get_object_or_404(CitaMedica, pk=pk)
    
    # Verificar que la cita pertenece al usuario
    if cita.mascota.usuario != request.user:
        return Response(
            {'error': 'No tienes permisos para acceder a esta cita.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'GET':
        serializer = CitaMedicaSerializer(cita)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = CitaMedicaSerializer(cita, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        cita.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def citas_proximas(request):
    """Obtiene las citas próximas del usuario"""
    ahora = timezone.now()
    proxima_semana = ahora + timedelta(days=7)
    
    citas = CitaMedica.objects.filter(
        mascota__usuario=request.user,
        fecha_cita__gte=ahora,
        fecha_cita__lte=proxima_semana
    ).order_by('fecha_cita')
    
    serializer = CitaMedicaSerializer(citas, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validar_peso(request):
    """Endpoint para validar peso sin crear cita"""
    peso = request.data.get('peso')
    
    if not peso:
        return Response(
            {'error': 'El campo peso es requerido.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        CitaMedica.validar_peso(peso)
        return Response({'valid': True, 'message': 'Peso válido'})
    except ValidationError as e:
        return Response(
            {'valid': False, 'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
        #deaqui*/