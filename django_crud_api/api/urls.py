from django_crud_api.urls import path
from . import views
from .views import PublicacionListCreateView



urlpatterns = [

    path('publicaciones/', PublicacionListCreateView.as_view(), name='publicacion-list-create'),
]