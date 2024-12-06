# membership/urls.py
from django.urls import path
from .views import calculate_membership_function

urlpatterns = [
    path('calculate/', calculate_membership_function),
]
