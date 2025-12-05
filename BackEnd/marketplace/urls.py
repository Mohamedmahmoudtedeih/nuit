"""
URL configuration for marketplace project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import api_root

urlpatterns = [
    path('', api_root, name='api_root'),
    path('api/', api_root, name='api_root_alt'),  # Also available at /api/
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/listings/', include('listings.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

