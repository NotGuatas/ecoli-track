from rest_framework import serializers
from .models import Activity

class ActivitySerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Activity
        fields = ['id', 'category', 'subtype', 'quantity', 'unit', 'date', 'owner', 'created_at', 'co2_kg']
        read_only_fields = ['id', 'date', 'created_at', 'co2_kg']
