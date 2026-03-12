# CitaPay M-Pesa Integration Plan for Quince Nutrition

## Executive Summary

This document outlines the integration plan for adding M-Pesa payment processing to Quince Nutrition using CitaPay as the payment processor. The integration will enable customers to purchase products (ebooks, supplements) and book services (wellness consultations, nutrition counseling) using M-Pesa STK push payments.

**Timeline**: 2-3 weeks for Phase 1 (Product Checkout), 1-2 weeks for Phase 2 (Service Bookings)

---

## Current State Analysis

### Existing Infrastructure

**Frontend (React + TypeScript + Vite)**

- ✅ Fully functional cart system with add/remove/quantity management
- ✅ Products page fetching from Airtable via Django API
- ✅ Cart displays total (KES currency)
- ❌ Checkout button disabled ("Coming Soon")
- ❌ No payment processing

**Backend (Django 4.2)**

- ✅ Products API endpoint (`/api/products/`)
- ✅ Airtable integration for product data
- ❌ No payment models (Order, Transaction, Payment)
- ❌ No CitaPay API client
- ❌ No webhook handlers

**Services**

- ✅ 6 service categories defined in constants (Wellness, Health Conditions, etc.)
- ❌ No booking system
- ❌ No service payment flow

### Payment Requirements

**Products (E-commerce)**

- Accept one-time M-Pesa payments for ebooks and supplements
- Process cart checkout with multiple items
- Email digital product delivery links
- Track order status

**Services (Bookings)**

- Accept one-time M-Pesa payments for consultations
- Support future subscriptions (monthly wellness programs)
- Send booking confirmation emails
- Calendar integration (future)

---

## Integration Architecture

### Phase 1: Product Checkout with M-Pesa (Priority)

#### 1.1 Django Backend - Data Models

Create new Django app: `payments`

```python
# apps/payments/models.py

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
    order_number = models.CharField(max_length=50, unique=True)  # e.g., ORD-20240115-1234

    # Customer info
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)  # M-Pesa phone: 254720428704

    # Order details
    items = models.JSONField()  # [{"id": "rec123", "title": "...", "price": 500, "quantity": 2}]
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
    status = models.CharField(max_length=50)  # completed, failed, pending
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3)
    payment_method = models.CharField(max_length=50)  # mpesa

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


class ServiceBooking(models.Model):
    """Service bookings (wellness consultations, etc.)"""
    STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_number = models.CharField(max_length=50, unique=True)

    # Customer info
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)

    # Service details
    service_id = models.CharField(max_length=50)  # e.g., "wellness"
    service_title = models.CharField(max_length=255)
    service_item = models.CharField(max_length=255)  # e.g., "Stress Management"
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='KES')

    # Booking details
    preferred_date = models.DateField(blank=True, null=True)
    preferred_time = models.TimeField(blank=True, null=True)
    notes = models.TextField(blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # CitaPay integration
    citapay_checkout_id = models.CharField(max_length=100, blank=True, null=True)
    citapay_transaction_id = models.CharField(max_length=100, blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.booking_number} - {self.service_title}"
```

#### 1.2 CitaPay Python Client

```python
# apps/payments/citapay_client.py

import requests
from typing import Dict, Optional, List
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class CitaPayClient:
    """Python client for CitaPay API"""

    def __init__(self):
        self.api_key = settings.CITAPAY_API_KEY  # sk_test_... or sk_live_...
        self.base_url = settings.CITAPAY_BASE_URL  # http://localhost:4000 or https://api.citapay.com
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }

    def create_checkout_session(
        self,
        amount: int,  # Amount in cents: 500.00 KES = 50000
        currency: str,
        customer_email: str,
        customer_phone: str,
        success_url: str,
        cancel_url: str,
        metadata: Optional[Dict] = None
    ) -> Dict:
        """
        Create a CitaPay checkout session for M-Pesa payment

        Returns:
            {
                "success": true,
                "session": {
                    "id": "cs_abc123",
                    "url": "https://checkout.citapay.com/cs_abc123",
                    "status": "pending"
                }
            }
        """
        payload = {
            'amount': amount,
            'currency': currency,
            'customer': {
                'email': customer_email,
                'phone': customer_phone
            },
            'successUrl': success_url,
            'cancelUrl': cancel_url,
            'paymentMethods': ['mpesa'],  # M-Pesa only
            'metadata': metadata or {}
        }

        try:
            response = requests.post(
                f'{self.base_url}/api/checkout/sessions',
                json=payload,
                headers=self.headers,
                timeout=10
            )
            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            logger.error(f"CitaPay API error: {e}")
            return {'success': False, 'error': str(e)}

    def get_transaction(self, transaction_id: str) -> Dict:
        """Get transaction details from CitaPay"""
        try:
            response = requests.get(
                f'{self.base_url}/api/transactions/{transaction_id}',
                headers=self.headers,
                timeout=10
            )
            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            logger.error(f"CitaPay API error: {e}")
            return {'success': False, 'error': str(e)}

    def verify_webhook_signature(self, payload: str, signature: str) -> bool:
        """Verify webhook signature from CitaPay"""
        import hmac
        import hashlib

        webhook_secret = settings.CITAPAY_WEBHOOK_SECRET
        expected_signature = hmac.new(
            webhook_secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(expected_signature, signature)
```

#### 1.3 Django Views & API Endpoints

```python
# apps/payments/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from .models import Order, Transaction
from .citapay_client import CitaPayClient
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
citapay = CitaPayClient()


@api_view(['POST'])
def create_checkout(request):
    """
    Create order and CitaPay checkout session

    Request body:
    {
        "customer": {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "254720428704"
        },
        "items": [
            {"id": "rec123", "title": "Nutrition Ebook", "price": 500, "quantity": 1}
        ],
        "shipping": 0
    }
    """
    try:
        data = request.data
        customer = data.get('customer', {})
        items = data.get('items', [])
        shipping_cost = data.get('shipping', 0)

        # Validation
        if not customer.get('email') or not customer.get('phone'):
            return Response(
                {'success': False, 'error': 'Customer email and phone are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not items:
            return Response(
                {'success': False, 'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate totals
        subtotal = sum(item['price'] * item['quantity'] for item in items)
        total = subtotal + shipping_cost

        # Generate order number
        order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{Order.objects.count() + 1:04d}"

        # Create order
        order = Order.objects.create(
            order_number=order_number,
            customer_name=customer.get('name', ''),
            customer_email=customer['email'],
            customer_phone=customer['phone'],
            items=items,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            total_amount=total,
            currency='KES',
            status='pending'
        )

        # Create CitaPay checkout session
        frontend_url = settings.FRONTEND_URL  # http://localhost:5173
        checkout_response = citapay.create_checkout_session(
            amount=int(total * 100),  # Convert to cents
            currency='KES',
            customer_email=customer['email'],
            customer_phone=customer['phone'],
            success_url=f'{frontend_url}/checkout/success?order_id={order.id}',
            cancel_url=f'{frontend_url}/checkout/cancelled?order_id={order.id}',
            metadata={
                'order_id': str(order.id),
                'order_number': order_number,
                'type': 'product_order'
            }
        )

        if not checkout_response.get('success'):
            order.status = 'failed'
            order.save()
            return Response(
                {'success': False, 'error': 'Failed to create checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Update order with CitaPay details
        session = checkout_response['session']
        order.citapay_checkout_id = session['id']
        order.citapay_checkout_url = session['url']
        order.save()

        return Response({
            'success': True,
            'order': {
                'id': str(order.id),
                'order_number': order.order_number,
                'total': float(order.total_amount)
            },
            'checkout_url': session['url']
        })

    except Exception as e:
        logger.error(f"Checkout creation error: {e}")
        return Response(
            {'success': False, 'error': 'Internal server error'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_order_status(request, order_id):
    """Get order status"""
    try:
        order = Order.objects.get(id=order_id)
        return Response({
            'success': True,
            'order': {
                'id': str(order.id),
                'order_number': order.order_number,
                'status': order.status,
                'total': float(order.total_amount),
                'paid_at': order.paid_at.isoformat() if order.paid_at else None,
                'items': order.items
            }
        })
    except Order.DoesNotExist:
        return Response(
            {'success': False, 'error': 'Order not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@csrf_exempt
def citapay_webhook(request):
    """
    Handle CitaPay webhooks for transaction updates

    Events:
    - transaction.completed
    - transaction.failed
    - checkout.expired
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        # Verify webhook signature
        signature = request.headers.get('X-CitaPay-Signature', '')
        payload = request.body.decode('utf-8')

        if not citapay.verify_webhook_signature(payload, signature):
            logger.warning("Invalid webhook signature")
            return JsonResponse({'error': 'Invalid signature'}, status=401)

        # Parse webhook data
        data = json.loads(payload)
        event_type = data.get('event')
        transaction_data = data.get('data', {})

        logger.info(f"Received webhook: {event_type}")

        # Handle transaction.completed
        if event_type == 'transaction.completed':
            transaction_id = transaction_data.get('id')
            metadata = transaction_data.get('metadata', {})
            order_id = metadata.get('order_id')

            if not order_id:
                logger.error("No order_id in webhook metadata")
                return JsonResponse({'error': 'Missing order_id'}, status=400)

            # Get order
            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                logger.error(f"Order {order_id} not found")
                return JsonResponse({'error': 'Order not found'}, status=404)

            # Create transaction record
            Transaction.objects.create(
                order=order,
                citapay_transaction_id=transaction_id,
                citapay_reference=transaction_data.get('reference', ''),
                status='completed',
                amount=transaction_data.get('amount', 0) / 100,  # Convert from cents
                currency=transaction_data.get('currency', 'KES'),
                payment_method=transaction_data.get('paymentMethod', 'mpesa'),
                mpesa_receipt=transaction_data.get('providerReference', ''),
                mpesa_phone=transaction_data.get('customer', {}).get('phone', ''),
                webhook_payload=transaction_data
            )

            # Update order
            order.status = 'completed'
            order.citapay_transaction_id = transaction_id
            order.citapay_reference = transaction_data.get('reference', '')
            order.paid_at = datetime.now()
            order.save()

            logger.info(f"Order {order.order_number} marked as completed")

            # TODO: Send order confirmation email
            # TODO: Send digital product download links

        elif event_type == 'transaction.failed':
            # Handle failed transactions
            metadata = transaction_data.get('metadata', {})
            order_id = metadata.get('order_id')

            if order_id:
                try:
                    order = Order.objects.get(id=order_id)
                    order.status = 'failed'
                    order.save()
                except Order.DoesNotExist:
                    pass

        return JsonResponse({'success': True})

    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
        return JsonResponse({'error': 'Internal server error'}, status=500)
```

#### 1.4 Django URLs Configuration

```python
# apps/payments/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('checkout/create/', views.create_checkout, name='create_checkout'),
    path('orders/<uuid:order_id>/', views.get_order_status, name='get_order_status'),
    path('webhooks/citapay/', views.citapay_webhook, name='citapay_webhook'),
]

# quince_project/urls.py - Add to main urls.py:
# path('api/payments/', include('apps.payments.urls')),
```

#### 1.5 Django Settings

```python
# quince_project/settings/base.py

INSTALLED_APPS = [
    # ... existing apps
    'apps.payments',
    'rest_framework',
]

# CitaPay Configuration
CITAPAY_API_KEY = os.getenv('CITAPAY_API_KEY', 'sk_test_...')
CITAPAY_BASE_URL = os.getenv('CITAPAY_BASE_URL', 'http://localhost:4000')
CITAPAY_WEBHOOK_SECRET = os.getenv('CITAPAY_WEBHOOK_SECRET', '')

# Frontend URL for redirects
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')
```

#### 1.6 Environment Variables

```bash
# .env

# CitaPay Configuration
CITAPAY_API_KEY=sk_test_your_test_key_here
CITAPAY_BASE_URL=http://localhost:4000
CITAPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

### Phase 1: Frontend Integration

#### 1.7 Add Checkout API Service

```typescript
// frontend/src/services/api.ts

export interface CheckoutRequest {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  shipping: number;
}

export interface CheckoutResponse {
  success: boolean;
  order?: {
    id: string;
    order_number: string;
    total: number;
  };
  checkout_url?: string;
  error?: string;
}

export interface OrderStatus {
  success: boolean;
  order?: {
    id: string;
    order_number: string;
    status: string;
    total: number;
    paid_at: string | null;
    items: any[];
  };
  error?: string;
}

/**
 * Create checkout session and get payment URL
 */
export async function createCheckout(
  data: CheckoutRequest,
): Promise<CheckoutResponse> {
  try {
    const response = await fetch(`${apiUrl}/api/payments/checkout/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating checkout:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create checkout",
    };
  }
}

/**
 * Get order status
 */
export async function getOrderStatus(orderId: string): Promise<OrderStatus> {
  try {
    const response = await fetch(`${apiUrl}/api/payments/orders/${orderId}/`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching order status:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch order status",
    };
  }
}
```

#### 1.8 Create Checkout Modal Component

```typescript
// frontend/src/components/CheckoutModal.tsx

import React, { useState } from 'react';
import { X, Loader, Phone, Mail, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createCheckout } from '@/services/api';
import type { CartItem } from '@/context/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
}

export default function CheckoutModal({ isOpen, onClose, cart, cartTotal }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setError('All fields are required');
      return false;
    }

    // Validate phone format (254XXXXXXXXX)
    const phoneRegex = /^254\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Phone must be in format: 254720428704');
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email address');
      return false;
    }

    return true;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const checkoutData = {
        customer: formData,
        items: cart.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        shipping: 0
      };

      const response = await createCheckout(checkoutData);

      if (response.success && response.checkout_url) {
        // Redirect to CitaPay checkout
        window.location.href = response.checkout_url;
      } else {
        setError(response.error || 'Failed to create checkout session');
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-serif text-stone-900">Checkout</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Order Summary */}
                <div className="mb-6 p-4 bg-emerald-50 rounded-lg">
                  <h3 className="font-semibold text-stone-900 mb-2">Order Summary</h3>
                  <div className="space-y-1 text-sm text-stone-700">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.title} × {item.quantity}</span>
                        <span>KES {(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-emerald-200 flex justify-between font-bold text-emerald-700">
                      <span>Total</span>
                      <span>KES {cartTotal.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleCheckout} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="john@example.com"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      M-Pesa Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                        placeholder="254720428704"
                        required
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Format: 254XXXXXXXXX (country code + 9 digits)
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      'Proceed to M-Pesa Payment'
                    )}
                  </button>

                  <p className="text-xs text-stone-500 text-center">
                    You will receive an M-Pesa STK push to complete payment
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

#### 1.9 Update Cart Page with Checkout

```typescript
// frontend/src/pages/Cart.tsx

// Add to imports:
import CheckoutModal from '../components/CheckoutModal';

// Add state in Cart component:
const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

// Replace the disabled button with:
<button
  onClick={() => setIsCheckoutOpen(true)}
  disabled={cart.length === 0}
  className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed mb-3"
>
  Proceed to Checkout
</button>

// Add modal before closing div:
<CheckoutModal
  isOpen={isCheckoutOpen}
  onClose={() => setIsCheckoutOpen(false)}
  cart={cart}
  cartTotal={cartTotal}
/>
```

#### 1.10 Create Success/Cancel Pages

```typescript
// frontend/src/pages/CheckoutSuccess.tsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Loader, Package, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { getOrderStatus } from '@/services/api';
import { useCart } from '@/context/CartContext';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }

    // Poll for order status (payment may take a few seconds)
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max

    const pollOrderStatus = async () => {
      const response = await getOrderStatus(orderId);

      if (response.success && response.order) {
        if (response.order.status === 'completed') {
          setOrder(response.order);
          setLoading(false);
          clearCart(); // Clear cart on successful payment
          return true;
        } else if (response.order.status === 'failed') {
          setError('Payment failed. Please try again.');
          setLoading(false);
          return true;
        }
      }

      attempts++;
      if (attempts >= maxAttempts) {
        setError('Payment is being processed. Check your email for confirmation.');
        setLoading(false);
        return true;
      }

      return false;
    };

    const interval = setInterval(async () => {
      const done = await pollOrderStatus();
      if (done) clearInterval(interval);
    }, 1000);

    // Initial check
    pollOrderStatus();

    return () => clearInterval(interval);
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <div className="bg-stone-50 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-stone-50 min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-serif text-stone-900 mb-2">Payment Issue</h1>
          <p className="text-stone-600 mb-6">{error}</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pt-20 px-4">
      <Helmet>
        <title>Payment Successful - Quince Nutrition</title>
      </Helmet>

      <div className="max-w-2xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          {/* Success Icon */}
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>

          <h1 className="text-3xl font-serif text-stone-900 mb-2">Payment Successful!</h1>
          <p className="text-stone-600 mb-8">
            Thank you for your order. We've received your payment.
          </p>

          {/* Order Details */}
          <div className="bg-stone-50 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-emerald-600" />
              <h2 className="font-semibold text-stone-900">Order Details</h2>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Order Number:</span>
                <span className="font-mono font-semibold">{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Total Paid:</span>
                <span className="font-semibold text-emerald-600">KES {order.total.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Payment Date:</span>
                <span className="font-semibold">
                  {new Date(order.paid_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-200">
              <h3 className="font-semibold mb-3">Items:</h3>
              <ul className="space-y-2">
                {order.items.map((item: any) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>{item.title} × {item.quantity}</span>
                    <span className="font-semibold">KES {(item.price * item.quantity).toFixed(0)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left text-sm">
            <p className="text-blue-900">
              📧 <strong>Check your email!</strong> We've sent your order confirmation and download links to your email address.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="flex-1 bg-stone-100 text-stone-700 py-3 rounded-lg font-semibold hover:bg-stone-200 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              Back to Home
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

```typescript
// frontend/src/pages/CheckoutCancelled.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { XCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function CheckoutCancelled() {
  return (
    <div className="bg-stone-50 min-h-screen pt-20 px-4">
      <Helmet>
        <title>Checkout Cancelled - Quince Nutrition</title>
      </Helmet>

      <div className="max-w-md mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-orange-600" />
          </div>

          <h1 className="text-3xl font-serif text-stone-900 mb-2">Checkout Cancelled</h1>
          <p className="text-stone-600 mb-8">
            Your payment was not completed. Your cart items are still saved.
          </p>

          <div className="flex flex-col gap-4">
            <Link
              to="/cart"
              className="bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              Return to Cart
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/products"
              className="bg-stone-100 text-stone-700 py-3 rounded-lg font-semibold hover:bg-stone-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

#### 1.11 Add Routes

```typescript
// frontend/src/routes.ts (or wherever routes are defined)

// Add these imports and routes:
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancelled from './pages/CheckoutCancelled';

// Add to routes array:
{
  path: '/checkout/success',
  element: <CheckoutSuccess />
},
{
  path: '/checkout/cancelled',
  element: <CheckoutCancelled />
}
```

---

## Phase 2: Service Bookings (Optional - After Products Work)

### Implementation Summary

Similar to product checkout but for services:

1. **Add pricing to services** in constants.ts or fetch from backend
2. **Add "Book Now" buttons** to Services page
3. **Create ServiceBookingModal** component (similar to CheckoutModal)
4. **Backend endpoint**: `/api/payments/bookings/create/`
5. **Same webhook handler** processes both products and service bookings

---

## Testing Plan

### Local Development Testing

1. **Start CitaPay backend**:

   ```bash
   cd /Users/mac/Desktop/projects/citapay/apps/api
   pnpm dev
   ```

2. **Start Quince backend**:

   ```bash
   cd /Users/mac/Desktop/clients/Quince-Nutrition
   python manage.py runserver
   ```

3. **Start Quince frontend**:

   ```bash
   cd /Users/mac/Desktop/clients/Quince-Nutrition/frontend
   npm run dev
   ```

4. **Test checkout flow**:
   - Add products to cart
   - Click "Proceed to Checkout"
   - Fill in customer details (use format: 254720428704)
   - Submit and verify redirect to CitaPay checkout
   - On CitaPay checkout page, use test M-Pesa number: `254720000000`
   - Wait for M-Pesa STK push simulation
   - Verify redirect back to success page
   - Check order status in Django admin

5. **Test webhook**:
   - Use ngrok to expose local Django server:
     ```bash
     ngrok http 8000
     ```
   - Update CitaPay merchant settings with ngrok webhook URL:
     `https://abc123.ngrok.io/api/payments/webhooks/citapay/`
   - Complete test payment
   - Verify webhook received and order updated

### M-Pesa Sandbox Testing

Use Daraja Sandbox credentials (already configured in CitaPay):

- Test phone: `254720000000` to `254729999999`
- STK PIN: `1234` (simulated)
- No real money charged

---

## Production Deployment Checklist

### CitaPay Platform

- [ ] Switch to production M-Pesa API keys
- [ ] Update `MPESA_ENVIRONMENT=production`
- [ ] Deploy CitaPay to production server
- [ ] Configure production webhook URL

### Quince Nutrition

- [ ] Create `apps/payments` Django app
- [ ] Run migrations: `python manage.py makemigrations && python manage.py migrate`
- [ ] Add production environment variables:
  - `CITAPAY_API_KEY=sk_live_...`
  - `CITAPAY_BASE_URL=https://api.citapay.com`
  - `CITAPAY_WEBHOOK_SECRET=...`
  - `FRONTEND_URL=https://quince-nutrition.com`
- [ ] Deploy backend with webhook endpoint
- [ ] Test webhook with production URL
- [ ] Deploy frontend with checkout flow
- [ ] Test end-to-end payment with real M-Pesa (small amount)

### CitaPay Configuration

1. Login to CitaPay dashboard (web app)
2. Go to Settings → Webhooks
3. Add webhook URL: `https://api.quince-nutrition.com/api/payments/webhooks/citapay/`
4. Enable events:
   - `transaction.completed`
   - `transaction.failed`
   - `checkout.expired`
5. Copy webhook secret to Django `.env`

---

## Post-Integration Features (Future Phases)

### Phase 3: Email Notifications

- Order confirmation emails
- Digital product download links
- Receipt with M-Pesa transaction details
- Service booking confirmation

### Phase 4: Admin Dashboard

- View all orders in Django admin
- Track payment status
- Resend confirmation emails
- Generate sales reports

### Phase 5: Service Subscriptions

- Monthly wellness program subscriptions
- Auto-recurring M-Pesa payments via CitaPay subscriptions API
- Subscription management portal

### Phase 6: Enhanced UX

- Save customer details for faster checkout
- Order history for returning customers
- Download invoices as PDF
- Track order status in real-time

---

## Cost Estimation

### CitaPay Fees (M-Pesa)

- **Test Mode**: Free (no charges)
- **Production**: M-Pesa fees apply (typically 1-3% per transaction, charged by Safaricom)
- **CitaPay Platform Fee**: Configure in your pricing model (e.g., 0.5% platform fee)

### Development Time

- **Phase 1 (Products)**: 2-3 weeks
  - Backend models & API: 3-4 days
  - Frontend checkout flow: 3-4 days
  - Testing & debugging: 3-5 days
- **Phase 2 (Services)**: 1-2 weeks
  - Backend booking system: 2-3 days
  - Frontend booking UI: 2-3 days
  - Testing: 2-3 days

---

## Support & Documentation

### CitaPay Docs

- API Reference: http://localhost:4000/api/docs (Swagger)
- Webhook Events: See `/apps/api/docs/API.md`
- Test Credentials: In CitaPay `.env.example`

### Key Contacts

- **CitaPay Technical Support**: Check `/apps/api/README.md`
- **M-Pesa Daraja Support**: https://developer.safaricom.co.ke/
- **Quince Nutrition**: +254 720 428 704 / Info@quince-nutrition.com

---

## Summary

This integration plan provides a complete end-to-end M-Pesa payment solution for Quince Nutrition using CitaPay:

1. ✅ **Products**: Checkout cart with M-Pesa payments
2. ✅ **Backend**: Django models, CitaPay API client, webhook handler
3. ✅ **Frontend**: Checkout modal, success/cancel pages, order tracking
4. ✅ **Security**: Webhook signature verification, input validation
5. ✅ **UX**: STK push notification, real-time order status updates
6. ✅ **Scalability**: Prepared for service bookings and subscriptions

**Next Step**: Start with Phase 1.1 - Create Django `payments` app and models.
