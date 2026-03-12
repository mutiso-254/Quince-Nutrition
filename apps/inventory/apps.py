from django.apps import AppConfig


class InventoryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.inventory'
    verbose_name = 'Inventory & Products'
    
    def ready(self):
        """
        Import signal handlers or perform startup tasks here
        """
        pass
