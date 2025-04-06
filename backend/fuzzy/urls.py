from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('matrix/', include('matrix.urls')),
    path('membership/', include('membership.urls')),
    path('graphs/', include('graphs.urls')),
    path("api/v1/auth/", include('djoser.urls')), 
    path("api/v1/auth/", include('djoser.urls.jwt')),  
    path("asection/", include('asection.urls')),
    path("api/v1/quiz/", include("quiz.urls")),
    path('api/', include('videos.urls')),
    path('api/fuzzy_operations/', include('fuzzy_operations.urls')),
]
