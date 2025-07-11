from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import Publicacion

class PublicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicacion
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'author']
        extra_kwargs = {'author': {'read_only': True}}

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
        data = super().validate({'username': user.username, 'password': password})
        return data
