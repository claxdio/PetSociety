from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import Publicacion, Perfil, Mascota, Agenda, EventoAgenda, ProcesoAdopcion, MascotaPerdida, Comentario, Reaccion, Categoria, Reporte, ForoPyR, Sancion

class ForoPyRSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    usuario = serializers.PrimaryKeyRelatedField(read_only=True)  # <-- aquí!
    respuestas = serializers.SerializerMethodField()

    class Meta:
        model = ForoPyR
        fields = [
            'id',
            'usuario',
            'usuario_username',
            'contenido',
            'fecha_creacion',
            'parent',
            'titulo',
            'resuelta',
            'es_mejor_respuesta',
            'es_pregunta',
            'es_respuesta',
            'respuestas',
        ]
        read_only_fields = ['fecha_creacion', 'usuario_username', 'es_pregunta', 'es_respuesta', 'respuestas']

    def get_respuestas(self, obj):
        if obj.es_pregunta:
            respuestas = obj.respuestas.all()
            return ForoPyRSerializer(respuestas, many=True, context=self.context).data
        return None

class PerfilSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.ReadOnlyField()
    foto_perfil_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Perfil
        fields = [
            'id', 'nombre', 'apellido', 'nombre_completo', 'direccion', 
            'foto_perfil', 'foto_perfil_url', 'biografia', 'fecha_registro', 'tipo_usuario', 
            'cuenta_activa'
        ]
        read_only_fields = ['fecha_registro']
    
    def get_foto_perfil_url(self, obj):
        if obj.foto_perfil:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.foto_perfil.url)
            return obj.foto_perfil.url
        return None

class ReporteSerializer(serializers.ModelSerializer):
    publicacion_reportada = serializers.PrimaryKeyRelatedField(
        queryset=Publicacion.objects.all(),
        error_messages={
            'does_not_exist': 'La publicación especificada no existe',
            'incorrect_type': 'El ID de publicación debe ser un número'
        }
    )
    class Meta:
        model = Reporte
        fields = [
            'id',
            'publicacion_reportada',
            'usuario_reportante',
            'moderador_asignado',
            'motivo',
            'estado',
            'fecha_reporte',
            'fecha_resolucion',
            'notas_moderador',
        ]
        read_only_fields = [
            'usuario_reportante',
            'estado',
            'fecha_reporte',
            'fecha_resolucion',
            'notas_moderador',
            'moderador_asignado',
        ]

    def validate(self, data):
        publicacion = data.get('publicacion_reportada')
        usuario = self.context['request'].user

        if publicacion.usuario == usuario:
            raise serializers.ValidationError({
                "publicacion_reportada": "No puedes reportar tu propia publicación."
            })

        if Reporte.objects.filter(publicacion_reportada=publicacion, usuario_reportante=usuario).exists():
            raise serializers.ValidationError({
                "publicacion_reportada": "Ya has reportado esta publicación."
            })

        return data

    def create(self, validated_data):
        validated_data['usuario_reportante'] = self.context['request'].user
        return super().create(validated_data)

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
    
    class Meta:
        model = Mascota
        fields = [
            'id', 'usuario', 'nombre', 'especie', 
            'foto', 'direccion', 'fecha_registro', 'activa'
        ]
        read_only_fields = ['fecha_registro', 'usuario']

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

class ComentarioSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)
    
    class Meta:
        model = Comentario
        fields = ['id', 'usuario', 'contenido', 'fecha_creacion', 'es_oculto']
        read_only_fields = ['fecha_creacion']

class ReaccionSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)
    
    class Meta:
        model = Reaccion
        fields = ['id', 'usuario', 'tipo_reaccion', 'fecha_creacion']
        read_only_fields = ['fecha_creacion']

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion']

class PublicacionSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='usuario', 
        write_only=True,
        required=False  # Since it's set in perform_create
    )
    imagen = serializers.SerializerMethodField()
    comentarios = ComentarioSerializer(many=True, read_only=True)
    reacciones = ReaccionSerializer(many=True, read_only=True)
    categorias = CategoriaSerializer(many=True, read_only=True)
    mascotas_etiquetadas = MascotaSerializer(many=True, read_only=True)
    likes = serializers.SerializerMethodField()
    total_comentarios = serializers.SerializerMethodField()
    
    # Campos para escribir las relaciones many-to-many
    categoria_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True, 
        required=False
    )
    mascota_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True, 
        required=False
    )

    class Meta:
        model = Publicacion
        fields = [
            'id', 'usuario', 'usuario_id', 'descripcion', 'imagen', 
            'comentarios', 'reacciones', 'categorias', 'mascotas_etiquetadas',
            'fecha_creacion', 'tipo_publicacion', 'likes', 'total_comentarios',
            'categoria_ids', 'mascota_ids'
        ]
        read_only_fields = ['fecha_creacion']

    def get_imagen(self, obj):
        archivo = obj.archivos.filter(tipo_archivo='imagen').first()
        if archivo and archivo.ruta_archivo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(archivo.ruta_archivo.url)
            return archivo.ruta_archivo.url
        return None
    
    def get_likes(self, obj):
        return obj.reacciones.count()
    
    def get_total_comentarios(self, obj):
        return obj.comentarios.count()
    
    def create(self, validated_data):
        # Extraer los IDs de categorías y mascotas antes de crear la publicación
        categoria_ids = validated_data.pop('categoria_ids', [])
        mascota_ids = validated_data.pop('mascota_ids', [])
        
        # Crear la publicación
        publicacion = super().create(validated_data)
        
        # Agregar las relaciones many-to-many
        if categoria_ids:
            publicacion.categorias.set(categoria_ids)
        
        if mascota_ids:
            publicacion.mascotas_etiquetadas.set(mascota_ids)
        
        return publicacion

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

        if User.objects.filter(username=username_or_email).exists():
            user = authenticate(username=username_or_email, password=password)
        elif User.objects.filter(email=username_or_email).exists():
            user_obj = User.objects.get(email=username_or_email)
            user = authenticate(username=user_obj.username, password=password)

        if user is None:
            raise serializers.ValidationError('Credenciales inválidas.')

        if not user.is_active:
            raise serializers.ValidationError('Cuenta desactivada.')

        if hasattr(user, 'perfil') and not user.perfil.cuenta_activa:
            raise serializers.ValidationError('Cuenta bloqueada por administrador.')

        data = super().validate({'username': user.username, 'password': password})

        # ✅ Crear el token y agregarle el username al payload
        refresh = self.get_token(user)
        refresh['username'] = user.username  # <--- esto es lo que faltaba

        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        data['username'] = user.username

        return data

class SancionSerializer(serializers.ModelSerializer):
    moderador = UserSerializer(read_only=True)
    usuario_sancionado = UserSerializer(read_only=True)
    moderador_username = serializers.CharField(source='moderador.username', read_only=True)
    usuario_sancionado_username = serializers.CharField(source='usuario_sancionado.username', read_only=True)
    
    class Meta:
        model = Sancion
        fields = [
            'id', 'moderador', 'moderador_username', 'usuario_sancionado', 
            'usuario_sancionado_username', 'tipo_sancion', 'motivo', 
            'fecha_sancion', 'fecha_termino', 'activa', 'es_permanente', 'duracion'
        ]
        read_only_fields = ['fecha_sancion', 'es_permanente', 'duracion']

class AdminReporteSerializer(serializers.ModelSerializer):
    publicacion_reportada = PublicacionSerializer(read_only=True)
    usuario_reportante = UserSerializer(read_only=True)
    moderador_asignado = UserSerializer(read_only=True)
    usuario_reportante_username = serializers.CharField(source='usuario_reportante.username', read_only=True)
    moderador_asignado_username = serializers.CharField(source='moderador_asignado.username', read_only=True)
    
    class Meta:
        model = Reporte
        fields = [
            'id', 'publicacion_reportada', 'usuario_reportante', 'usuario_reportante_username',
            'moderador_asignado', 'moderador_asignado_username', 'motivo', 'estado', 
            'fecha_reporte', 'fecha_resolucion', 'notas_moderador'
        ]
        read_only_fields = ['fecha_reporte', 'usuario_reportante']

class AdminUserSerializer(serializers.ModelSerializer):
    perfil = PerfilSerializer(read_only=True)
    total_publicaciones = serializers.SerializerMethodField()
    total_reportes = serializers.SerializerMethodField()
    ultima_sancion = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'is_active', 
            'is_staff', 'is_superuser', 'date_joined', 'last_login', 'perfil',
            'total_publicaciones', 'total_reportes', 'ultima_sancion'
        ]
        read_only_fields = ['date_joined', 'last_login']
    
    def get_total_publicaciones(self, obj):
        return obj.publicaciones.count()
    
    def get_total_reportes(self, obj):
        # Contar reportes de las publicaciones del usuario
        return Reporte.objects.filter(publicacion_reportada__usuario=obj).count()
    
    def get_ultima_sancion(self, obj):
        ultima_sancion = obj.sanciones_recibidas.filter(activa=True).first()
        if ultima_sancion:
            return SancionSerializer(ultima_sancion).data
        return None