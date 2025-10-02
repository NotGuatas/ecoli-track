from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User

from .serializers import RegisterSerializer, MeSerializer, MeUpdateSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        if ser.is_valid():
            ser.save()
            return Response({"detail": "Usuario creado. Ahora inicia sesión."}, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(MeSerializer(request.user).data)

    def put(self, request):
        ser = MeUpdateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        user: User = request.user

        # Actualizar email (si llega)
        email = ser.validated_data.get("email")
        if email is not None:
            user.email = email

        # Cambiar password (si llega)
        new_password = ser.validated_data.get("password")
        if new_password:
            current = ser.validated_data.get("current_password", "")
            if not user.check_password(current):
                return Response({"current_password": ["No coincide."]}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(new_password)

        user.save()
        return Response({"detail": "Perfil actualizado correctamente."})

    def delete(self, request):
        # Requerimos current_password para borrar
        current_password = request.data.get("current_password", "")
        if not request.user.check_password(current_password):
            return Response({"current_password": ["No coincide."]}, status=status.HTTP_400_BAD_REQUEST)
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
