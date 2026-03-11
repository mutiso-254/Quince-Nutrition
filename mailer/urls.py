from django.urls import path
from . import views

urlpatterns = [
    path('send/', views.send_contact_email, name='send_contact_email'),
    path('products/', views.get_products, name='get_products'),
]
