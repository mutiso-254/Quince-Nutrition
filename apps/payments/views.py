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
        frontend_url = settings.FRONTEND_URL
        checkout_response = citapay.create_checkout_session(
            amount=int(total),  # KES amounts are in shillings, not cents
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
            logger.error(f"Checkout error response: {checkout_response}")
            return Response(
                {'success': False, 'error': 'Failed to create checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # make sure session exists
        if 'session' not in checkout_response:
            order.status = 'failed'
            order.save()
            logger.error(f"Missing session key in checkout response: {checkout_response}")
            return Response(
                {'success': False, 'error': 'Invalid checkout response from CitaPay'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Update order with CitaPay details
        session = checkout_response['session']
        order.citapay_checkout_id = session.get('id')
        order.citapay_checkout_url = session.get('url')
        order.save()
        
        return Response({
            'success': True,
            'order': {
                'id': str(order.id),
                'order_number': order.order_number,
                'total': float(order.total_amount)
            },
            'checkout_url': session.get('url')
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
            # data contains: {transactionId, merchantId, reference, amount, ...}
            transaction_id = transaction_data.get('transactionId')
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
                amount=transaction_data.get('amount', 0),  # Already in KES shillings
                currency=transaction_data.get('currency', 'KES'),
                payment_method=transaction_data.get('paymentMethod', 'mpesa'),
                mpesa_receipt=transaction_data.get('externalRef', ''),
                mpesa_phone=transaction_data.get('customerPhone', ''),
                webhook_payload=transaction_data
            )
            
            # Update order
            order.status = 'completed'
            order.citapay_transaction_id = transaction_id
            order.citapay_reference = transaction_data.get('reference', '')
            order.paid_at = datetime.now()
            order.save()
            
            logger.info(f"Order {order.order_number} marked as completed")
            
        elif event_type == 'transaction.failed':
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
