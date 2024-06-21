from django.urls import path
from . import views


urlpatterns = [
    path('', views.apple_list),
    path('conversations/', views.conversation_list),
]
