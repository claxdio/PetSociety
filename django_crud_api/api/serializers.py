from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
#de aqui*/
from .models import Publicacion, Perfil, Mascota, Agenda, EventoAgenda, ProcesoAdopcion, MascotaPerdida, CitaMedica
from django.core.exceptions import ValidationError
#aaaa aqui*/

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

class MascotaSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='usuario', 
        write_only=True
    )
    
    class Meta:
        model = Mascota
        fields = [
            'id', 'usuario', 'usuario_id', 'nombre', 'especie', 
            'foto', 'direccion', 'fecha_registro', 'activa'
        ]
        read_only_fields = ['fecha_registro']

class EventoAgendaSerializer(serializers.ModelSerializer):
    # Campos calculados
    es_pasado = serializers.ReadOnlyField()
    es_proximo = serializers.ReadOnlyField()
    
    class Meta:
        model = EventoAgenda
        fields = [
            'id', 'tipo_evento', 'motivo', 'fecha_evento', 'veterinario', 
            'lugar', 'costo', 'estado', 'fecha_completado', 'notas_completado',
            'fecha_creacion', 'fecha_actualizacion', 'es_pasado', 'es_proximo'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

class AgendaSerializer(serializers.ModelSerializer):
    mascota = MascotaSerializer(read_only=True)
    eventos = EventoAgendaSerializer(many=True, read_only=True)
    eventos_proximos = EventoAgendaSerializer(many=True, read_only=True)
    eventos_pasados = EventoAgendaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Agenda
        fields = [
            'id', 'mascota', 'titulo', 'descripcion', 'fecha_creacion', 
            'fecha_actualizacion', 'eventos', 'eventos_proximos', 'eventos_pasados'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

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
            'foto_usuario', 'comentarios', 'fecha_creacion', 'tipo_publicacion'
        ]
        read_only_fields = ['fecha_creacion']

class ProcesoAdopcionSerializer(serializers.ModelSerializer):
    publicacion = PublicacionSerializer(read_only=True)
    mascota = MascotaSerializer(read_only=True)
    solicitante = UserSerializer(read_only=True)
    propietario = UserSerializer(read_only=True)
    
    # Campos para escritura
    publicacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Publicacion.objects.all(), 
        source='publicacion', 
        write_only=True
    )
    mascota_id = serializers.PrimaryKeyRelatedField(
        queryset=Mascota.objects.all(), 
        source='mascota', 
        write_only=True
    )
    
    # Campos calculados
    es_activo = serializers.ReadOnlyField()
    
    class Meta:
        model = ProcesoAdopcion
        fields = [
            'id', 'publicacion', 'publicacion_id', 'mascota', 'mascota_id',
            'solicitante', 'propietario', 'estado', 'motivo_adopcion',
            'experiencia_mascotas', 'tiempo_disponible', 'vivienda_adecuada',
            'otros_mascotas', 'descripcion_otros_mascotas', 'telefono_solicitante',
            'direccion_solicitante', 'fecha_solicitud', 'fecha_resolucion',
            'fecha_completado', 'comentarios_propietario', 'comentarios_solicitante',
            'es_activo'
        ]
        read_only_fields = ['fecha_solicitud', 'solicitante', 'propietario']

class MascotaPerdidaSerializer(serializers.ModelSerializer):
    publicacion = PublicacionSerializer(read_only=True)
    mascota = MascotaSerializer(read_only=True)
    
    # Campos para escritura
    publicacion_id = serializers.PrimaryKeyRelatedField(
        queryset=Publicacion.objects.all(), 
        source='publicacion', 
        write_only=True
    )
    mascota_id = serializers.PrimaryKeyRelatedField(
        queryset=Mascota.objects.all(), 
        source='mascota', 
        write_only=True,
        required=False,
        allow_null=True
    )
    
    # Campos calculados
    coordenadas_validas = serializers.ReadOnlyField()
    es_activa = serializers.ReadOnlyField()
    
    class Meta:
        model = MascotaPerdida
        fields = [
            'id', 'publicacion', 'publicacion_id', 'mascota', 'mascota_id',
            'nombre', 'especie', 'raza', 'color', 'tamano', 'foto',
            'fecha_perdida', 'lugar_perdida', 'descripcion', 'estado',
            'telefono_contacto', 'email_contacto', 'latitud', 'longitud',
            'direccion_aproximada', 'caracteristicas_especiales',
            'fecha_publicacion', 'fecha_encontrada', 'coordenadas_validas', 'es_activa'
        ]
        read_only_fields = ['fecha_publicacion']

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
#deaqui*/
class CitaMedicaSerializer(serializers.ModelSerializer):
    """Serializer para citas médicas con validación de peso"""
    mascota = MascotaSerializer(read_only=True)
    mascota_id = serializers.PrimaryKeyRelatedField(
        queryset=Mascota.objects.all(), 
        source='mascota', 
        write_only=True
    )
    
    # Campos calculados
    peso_normalizado = serializers.ReadOnlyField()
    es_pasada = serializers.ReadOnlyField()
    es_proxima = serializers.ReadOnlyField()
    
    class Meta:
        model = CitaMedica
        fields = [
            'id', 'mascota', 'mascota_id', 'tipo_cita', 'fecha_cita', 
            'peso', 'caso', 'proxima_cita', 'veterinario', 'lugar', 
            'costo', 'notas_adicionales', 'fecha_creacion', 'fecha_actualizacion',
            'peso_normalizado', 'es_pasada', 'es_proxima'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']
    
    def validate_peso(self, value):
        """Validación personalizada del campo peso"""
        if not value or not value.strip():
            raise serializers.ValidationError("El peso es requerido.")
        
        # Usar la misma validación del modelo
        try:
            CitaMedica.validar_peso(value)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))
        
        return value.strip()
    
    def validate_fecha_cita(self, value):
        """Validación de la fecha de cita"""
        from django.utils import timezone
        
        if value and value < timezone.now():
            raise serializers.ValidationError("La fecha de la cita no puede ser en el pasado.")
        
        return value
    
    def validate(self, data):
        """Validación a nivel de objeto"""
        # Validar que la próxima cita sea después de la fecha actual
        fecha_cita = data.get('fecha_cita')
        proxima_cita = data.get('proxima_cita')
        
        if proxima_cita and fecha_cita and proxima_cita <= fecha_cita:
            raise serializers.ValidationError({
                'proxima_cita': "La próxima cita debe ser después de la fecha actual."
            })
        
        return data

        #ddddaqui*/
