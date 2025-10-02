from rest_framework import serializers
from .models import Activity
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
class ActivitySerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Activity
        fields = ['id', 'category', 'subtype', 'quantity', 'unit', 'date', 'owner', 'created_at', 'co2_kg']
        read_only_fields = ['id', 'date', 'created_at', 'co2_kg']
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def validate_password(self, value):
        # Puedes usar validadores de Django si quieres más reglas
        validate_password(value)
        return value

    def create(self, validated_data):
        user = User(username=validated_data["username"], email=validated_data.get("email", ""))
        user.set_password(validated_data["password"])
        user.save()
        return user

class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "date_joined")

class MeUpdateSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False, min_length=6)
    current_password = serializers.CharField(write_only=True, required=False)

    def validate(self, attrs):
        # Si se intenta cambiar password, current_password es obligatorio
        if "password" in attrs and not attrs.get("current_password"):
            raise serializers.ValidationError({"current_password": "Requerido para cambiar la contraseña."})
        return attrs