from django_crud_api.urls import path
from . import views


urlpatterns = [
    path('notes/', views.NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/delete/<int:pk>/', views.NoteDetailView.as_view(), name='delete-note'),
]