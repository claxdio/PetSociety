from django.urls import path
from . import views
from .views import (
    PublicacionListCreateView, user_info, admin_login,
    PerfilDetailView, UserDetailView, CreateUserView
)

urlpatterns = [
    path('publicaciones/', PublicacionListCreateView.as_view(), name='publicacion-list-create'),
    path('user/info/', user_info, name='user-info'),
    path('admin/login/', admin_login, name='admin-login'),
    path('user/register/', CreateUserView.as_view(), name='user-register'),
    path('user/profile/', PerfilDetailView.as_view(), name='perfil-detail'),
    path('user/detail/', UserDetailView.as_view(), name='user-detail'),
]