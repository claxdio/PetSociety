from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .models import Publicacion
from .serializers import PublicacionSerializer

class PublicacionListCreateView(generics.ListCreateAPIView):
    serializer_class = PublicacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Publicacion.objects.all() #type: ignore

    def perform_create(self, serializer):   #type: ignore
        serializer.save(usuario=self.request.user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

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
        'is_admin': user.is_staff or user.is_superuser
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
            'is_admin': True
        }
    })