from django.db import models
from django.contrib.auth.models import User
from .emissions import estimate_co2

class Activity(models.Model):
    CATEGORY_CHOICES = [
        ('transporte', 'Transporte'),
        ('energia', 'Energía'),
        ('alimentacion', 'Alimentación'),
    ]

    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES)
    subtype = models.CharField(max_length=50)   # bus, auto_gasolina, ducha_electrica, res, etc.
    quantity = models.FloatField()              # km, min, kg (según category)
    unit = models.CharField(max_length=16)      # 'km', 'min', 'kg'
    date = models.DateField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    created_at = models.DateTimeField(auto_now_add=True)

    # NUEVO: CO2 calculado automáticamente (kg)
    co2_kg = models.FloatField(default=0.0)

    def save(self, *args, **kwargs):
        # Calcula antes de guardar
        self.co2_kg = estimate_co2(self.category, self.subtype, self.quantity, self.unit)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.owner.username} - {self.category} - {self.subtype} ({self.quantity} {self.unit})"
