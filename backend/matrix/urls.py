from django.urls import path
from .views import compute_composition

urlpatterns = [
    path('compute_composition/', compute_composition, name='compute_composition'),
]
