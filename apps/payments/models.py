from django.db import models
from django.utils import timezone
import uuid


class Order(models.Model):
    """Customer orders for products"""
    STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=50, unique=True)
    
    # Customer info
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    
    # Order details
    items = models.JSONField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='KES')
    
    # Payment tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # CitaPay integration
    citapay_checkout_id = models.CharField(max_length=100, blank=True, null=True)
    citapay_checkout_url = models.URLField(blank=True, null=True)
    citapay_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    citapay_reference = models.CharField(max_length=100, blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.order_number} - {self.customer_name} - KES {self.total_amount}"


class Transaction(models.Model):
    """Payment transactions from CitaPay webhooks"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='transactions')
    
    # CitaPay transaction data
    citapay_transaction_id = models.CharField(max_length=100, unique=True)
    citapay_reference = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3)
    payment_method = models.CharField(max_length=50)
    
    # M-Pesa specific
    mpesa_receipt = models.CharField(max_length=100, blank=True)
    mpesa_phone = models.CharField(max_length=20, blank=True)
    
    # Metadata
    webhook_payload = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.citapay_transaction_id} - {self.status}"
