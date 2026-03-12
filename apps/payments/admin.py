from django.contrib import admin
from .models import Order, Transaction


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer_name', 'customer_email', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_number', 'customer_name', 'customer_email', 'customer_phone']
    readonly_fields = ['id', 'created_at', 'updated_at', 'paid_at']
    
    fieldsets = (
        ('Order Information', {
            'fields': ('id', 'order_number', 'status')
        }),
        ('Customer Details', {
            'fields': ('customer_name', 'customer_email', 'customer_phone')
        }),
        ('Order Details', {
            'fields': ('items', 'subtotal', 'shipping_cost', 'total_amount', 'currency')
        }),
        ('Payment Information', {
            'fields': ('citapay_checkout_id', 'citapay_checkout_url', 'citapay_transaction_id', 'citapay_reference')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'paid_at')
        }),
    )


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['citapay_transaction_id', 'order', 'payment_method', 'amount', 'status', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['citapay_transaction_id', 'citapay_reference', 'mpesa_receipt', 'mpesa_phone']
    readonly_fields = ['id', 'created_at']
    
    fieldsets = (
        ('Transaction Information', {
            'fields': ('id', 'order', 'citapay_transaction_id', 'citapay_reference', 'status')
        }),
        ('Payment Details', {
            'fields': ('payment_method', 'amount', 'currency')
        }),
        ('M-Pesa Details', {
            'fields': ('mpesa_receipt', 'mpesa_phone'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('webhook_payload', 'created_at'),
            'classes': ('collapse',)
        }),
    )
