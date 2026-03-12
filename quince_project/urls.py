"""
URL configuration for quince_project project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),

    # API endpoint for contact form emails / products
    path('api/contact/', include('apps.contacts.urls')),
    # you can add other app routes here, e.g. inventory

    # Serve the React frontend for all other routes
    re_path(r'^(?!api/|admin/|assets/).*$', TemplateView.as_view(template_name='index.html'), name='frontend'),
]
