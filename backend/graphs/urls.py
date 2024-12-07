from django.urls import path
from .views import generate_transition_graph

urlpatterns = [
    path('generate_transition_graph/', generate_transition_graph, name='generate_transition_graph'),
]
