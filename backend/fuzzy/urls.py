from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls')),
    path('matrix/', include('matrix.urls')),
    path('membership/', include('membership.urls')),
]
