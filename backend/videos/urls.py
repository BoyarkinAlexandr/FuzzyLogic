from django.urls import path
from .views import VideoListView, AddVideoView, DeleteVideoView

urlpatterns = [
    path('videos/<str:topic>/', VideoListView.as_view(), name='video-list'),
    path('videos/<str:topic>/add/', AddVideoView.as_view(), name='add-video'),
    path('videos/<str:topic>/delete/', DeleteVideoView.as_view(), name='delete-video'),
]