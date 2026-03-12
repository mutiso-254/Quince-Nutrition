from django.db import models

# Create your models here.

# Future: Add product, inventory, or order models here
# Example:
# class Product(models.Model):
#     CATEGORY_CHOICES = [
#         ('ebook', 'E-Book'),
#         ('supplement', 'Supplement'),
#     ]
#     
#     name = models.CharField(max_length=200)
#     description = models.TextField()
#     price = models.DecimalField(max_digits=10, decimal_places=2)
#     category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
#     features = models.TextField(blank=True)
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     
#     class Meta:
#         ordering = ['name']
#         verbose_name = 'Product'
#         verbose_name_plural = 'Products'
