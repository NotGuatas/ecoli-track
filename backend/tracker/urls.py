from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityViewSet
from .views_auth import RegisterView, MeView  

router = DefaultRouter()
router.register(r'activities', ActivityViewSet, basename='activity')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view()),  # POST
    path('auth/me/', MeView.as_view()),              # GET, PUT, DELETE
]