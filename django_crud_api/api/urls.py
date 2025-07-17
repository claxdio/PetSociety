from django.urls import path
from . import views
from .views import PublicacionListCreateView, user_info, admin_login

urlpatterns = [
    path('publicaciones/', PublicacionListCreateView.as_view(), name='publicacion-list-create'),
    path('user/info/', user_info, name='user-info'),
    path('admin/login/', admin_login, name='admin-login')
]