from django.urls import path
from . import views


urlpatterns = [
    path('', views.apple_list),
    path('conversation_list/', views.conversation_list),
    path('conversation/', views.conversation),
    path('messages/', views.message)
]
