from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import Publicacion, Perfil

class PerfilSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()
    
    class Meta:
        model = Perfil
        fields = [
            'id', 'nombre', 'apellido', 'nombre_completo', 'direccion', 
            'foto_perfil', 'biografia', 'fecha_registro', 'tipo_usuario', 
            'cuenta_activa'
        ]
        read_only_fields = ['fecha_registro']

class UserSerializer(serializers.ModelSerializer):
    perfil = PerfilSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'last_login', 
            'is_active', 'date_joined', 'perfil'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'last_login': {'read_only': True},
            'date_joined': {'read_only': True},
            'is_active': {'read_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserRegistrationSerializer(serializers.ModelSerializer):
    perfil = PerfilSerializer(required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'perfil'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        perfil_data = validated_data.pop('perfil', {})
        user = User.objects.create_user(**validated_data)
        
        # Actualizar el perfil con los datos proporcionados
        if perfil_data:
            for attr, value in perfil_data.items():
                setattr(user.perfil, attr, value)
            user.perfil.save()
        
        return user

class PublicacionSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='usuario', 
        write_only=True
    )
    
    class Meta:
        model = Publicacion
        fields = [
            'id', 'usuario', 'usuario_id', 'descripcion', 'imagen', 
            'foto_usuario', 'comentarios', 'fecha_creacion'
        ]
        read_only_fields = ['fecha_creacion']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get('username')
        password = attrs.get('password')
        user = None
        # Buscar por username o email
        if User.objects.filter(username=username_or_email).exists():
            user = authenticate(username=username_or_email, password=password)
        elif User.objects.filter(email=username_or_email).exists():
            user_obj = User.objects.get(email=username_or_email)
            user = authenticate(username=user_obj.username, password=password)
        if user is None:
            raise serializers.ValidationError('Credenciales inválidas.')
        
        # Verificar si la cuenta está activa
        if not user.is_active:
            raise serializers.ValidationError('Cuenta desactivada.')
        
        # Verificar si el perfil está activo
        if hasattr(user, 'perfil') and not user.perfil.cuenta_activa:
            raise serializers.ValidationError('Cuenta bloqueada por administrador.')
        
        data = super().validate({'username': user.username, 'password': password})
        return data
