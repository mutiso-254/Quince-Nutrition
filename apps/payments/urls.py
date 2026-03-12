from django.urls import path
from . import views

urlpatterns = [
    path('checkout/create/', views.create_checkout, name='create_checkout'),
    path('orders/<uuid:order_id>/', views.get_order_status, name='get_order_status'),
    path('webhooks/citapay/', views.citapay_webhook, name='citapay_webhook'),
    path('webhooks/citapay', views.citapay_webhook, name='citapay_webhook_no_slash'),  # Support both with/without slash
]
