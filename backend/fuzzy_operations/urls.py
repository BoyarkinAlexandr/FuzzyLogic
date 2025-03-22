# backend/fuzzy_operations/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('calculate_oper/', views.fuzzy_calculate, name='fuzzy_calculate'),
]