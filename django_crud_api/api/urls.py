from django.urls import path
from . import views
from .views import (
    PublicacionListCreateView, user_info, admin_login,
    PerfilDetailView, UserDetailView, CreateUserView,
    MascotaListCreateView, MascotaDetailView,
    AgendaDetailView, EventoAgendaListCreateView, EventoAgendaDetailView,
    ProcesoAdopcionListCreateView, ProcesoAdopcionDetailView,
    MascotaPerdidaListCreateView, MascotaPerdidaDetailView
)

urlpatterns = [
    path('publicaciones/', PublicacionListCreateView.as_view(), name='publicacion-list-create'),
    path('user/info/', user_info, name='user-info'),
    path('admin/login/', admin_login, name='admin-login'),
    path('user/register/', CreateUserView.as_view(), name='user-register'),
    path('user/profile/', PerfilDetailView.as_view(), name='perfil-detail'),
    path('user/detail/', UserDetailView.as_view(), name='user-detail'),
    
    # Endpoints para Mascotas
    path('mascotas/', MascotaListCreateView.as_view(), name='mascota-list-create'),
    path('mascotas/<int:pk>/', MascotaDetailView.as_view(), name='mascota-detail'),
    
    # Endpoints para Agenda
    path('agenda/<int:pk>/', AgendaDetailView.as_view(), name='agenda-detail'),
    
    # Endpoints para Eventos de Agenda
    path('eventos-agenda/', EventoAgendaListCreateView.as_view(), name='evento-agenda-list-create'),
    path('eventos-agenda/<int:pk>/', EventoAgendaDetailView.as_view(), name='evento-agenda-detail'),
    
    # Endpoints para Proceso de Adopción
    path('procesos-adopcion/', ProcesoAdopcionListCreateView.as_view(), name='proceso-adopcion-list-create'),
    path('procesos-adopcion/<int:pk>/', ProcesoAdopcionDetailView.as_view(), name='proceso-adopcion-detail'),
    
    # Endpoints para Mascota Perdida
    path('mascotas-perdidas/', MascotaPerdidaListCreateView.as_view(), name='mascota-perdida-list-create'),
    path('mascotas-perdidas/<int:pk>/', MascotaPerdidaDetailView.as_view(), name='mascota-perdida-detail'),
]