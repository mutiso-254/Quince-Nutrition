import requests
from typing import Dict, Optional
from django.conf import settings
import logging
import hmac
import hashlib

logger = logging.getLogger(__name__)


class CitaPayClient:
    """Python client for CitaPay API"""
    
    def __init__(self):
        self.api_key = settings.CITAPAY_API_KEY
        self.base_url = settings.CITAPAY_BASE_URL
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
    
    def create_checkout_session(
        self,
        amount: int,
        currency: str,
        customer_email: str,
        customer_phone: str,
        success_url: str,
        cancel_url: str,
        metadata: Optional[Dict] = None
    ) -> Dict:
        """
        Create a CitaPay checkout session for M-Pesa payment
        
        Args:
            amount: Amount in cents (500.00 KES = 50000)
            currency: Currency code (e.g., 'KES')
            customer_email: Customer email address
            customer_phone: Customer phone number (254XXXXXXXXX)
            success_url: URL to redirect after successful payment
            cancel_url: URL to redirect after cancelled payment
            metadata: Optional metadata dictionary
            
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
            'paymentMethods': ['mpesa'],
            'metadata': metadata or {}
        }
        
        try:
            # ensure we don't double-up on "/api" segments; merchant may set base URL
            # to something like "http://localhost:5002/api/v1"
            endpoint = f"{self.base_url.rstrip('/')}/checkout/sessions"
            response = requests.post(
                endpoint,
                json=payload,
                headers=self.headers,
                timeout=10
            )
            response.raise_for_status()
            result = response.json()
            # normalize to {success, session: {...}}
            if result.get('success') and 'data' in result:
                data = result['data']
                # detect new API shape
                if 'sessionId' in data or 'checkoutUrl' in data:
                    result = {
                        'success': result.get('success', True),
                        'session': {
                            'id': data.get('sessionId'),
                            'url': data.get('checkoutUrl'),
                            'status': data.get('status')
                        }
                    }
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f"CitaPay API error: {e}")
            return {'success': False, 'error': str(e)}
    
    def get_transaction(self, transaction_id: str) -> Dict:
        """Get transaction details from CitaPay"""
        try:
            endpoint = f"{self.base_url.rstrip('/')}/transactions/{transaction_id}"
            response = requests.get(
                endpoint,
                headers=self.headers,
                timeout=10
            )
            response.raise_for_status()
            result = response.json()
            
            # normalize wrapped response {success, data: {transaction}}
            if result.get('success') and 'data' in result:
                return {
                    'success': True,
                    'transaction': result['data']
                }
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f"CitaPay API error: {e}")
            return {'success': False, 'error': str(e)}
    
    def verify_webhook_signature(self, payload: str, signature: str) -> bool:
        """Verify webhook signature from CitaPay"""
        webhook_secret = settings.CITAPAY_WEBHOOK_SECRET
        expected_signature = hmac.new(
            webhook_secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(expected_signature, signature)
