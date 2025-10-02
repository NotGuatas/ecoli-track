from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.timezone import now
from django.db.models import Sum
from .models import Activity
from .serializers import ActivitySerializer

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Activity.objects.filter(owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def summary_today(self, request):
        today = now().date()
        qs = self.get_queryset().filter(date=today)
        total = qs.aggregate(total=Sum('co2_kg'))['total'] or 0.0
        by_cat = {"transporte": 0.0, "energia": 0.0, "alimentacion": 0.0}
        for a in qs:
            by_cat[a.category] = by_cat.get(a.category, 0.0) + (a.co2_kg or 0.0)

        tips = []
        if by_cat["transporte"] > total * 0.5:
            tips.append("Usa transporte público, camina o bicicleta en trayectos cortos.")
        if by_cat["energia"] > total * 0.3:
            tips.append("Reduce minutos de ducha o instala cabezal eficiente.")
        if by_cat["alimentacion"] > total * 0.3:
            tips.append("Cambia carne roja por pollo/legumbres 1–2 veces por semana.")

        return Response({
            "date": str(today),
            "total_co2_kg": round(total, 3),
            "by_category": {k: round(v, 3) for k, v in by_cat.items()},
            "tips": tips
        })
