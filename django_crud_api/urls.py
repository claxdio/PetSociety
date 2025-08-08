from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django_crud_api.api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django_crud_api.api.serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenViewBase
from django_crud_api.api.views import ForoPyRListCreateView, ForoPyRDeleteView, ForoPyRDetailView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api/', include('django_crud_api.api.urls')),
        path("forum/", ForoPyRListCreateView.as_view(), name="foro-list-create"),
    path("forum/<int:pk>/", ForoPyRDetailView.as_view(), name="foro-detail"),
    path("forum/<int:pk>/delete/", ForoPyRDeleteView.as_view(), name="foro-delete"),
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
