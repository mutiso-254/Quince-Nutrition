"""
Airtable API service module for Quince Nutrition.
Handles all interactions with the Airtable database for contact-related
operations (contact form responses, etc.).
"""

import requests
from django.conf import settings
from datetime import datetime


AIRTABLE_API_URL = f"https://api.airtable.com/v0/{settings.AIRTABLE_BASE_ID}"
HEADERS = {
    "Authorization": f"Bearer {settings.AIRTABLE_ACCESS_TOKEN}",
    "Content-Type": "application/json"
}


def fetch_inventory():
    """
    Fetch all products from the Inventory table in Airtable.
    
    Returns:
        list: List of product records with fields:
              - id (record ID)
              - itemName
              - itemDescription
              - itemPrice
              - itemImages (array of attachment objects)
              - itemCategory ('ebook' or 'supplement')
    """
    url = f"{AIRTABLE_API_URL}/Inventory"
    
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        
        data = response.json()
        records = data.get('records', [])
        
        # Transform records to a cleaner format
        products = []
        for record in records:
            fields = record.get('fields', {})
            products.append({
                'id': record['id'],
                'itemName': fields.get('itemName', ''),
                'itemDescription': fields.get('itemDescription', ''),
                'itemPrice': fields.get('itemPrice', 0),
                'itemImages': fields.get('itemImages', []),
                'itemCategory': fields.get('itemCartegory', ''),  # Note: Airtable field has typo 'itemCartegory'
                'features': fields.get('features', ''),
            })
        
        return products
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching inventory from Airtable: {e}")
        return []


def save_contact_form_response(first_name, last_name, email, service_interest, message):
    """
    Save a contact form submission to the Contact Form Responses table in Airtable.
    
    Args:
        first_name (str): Contact's first name
        last_name (str): Contact's last name
        email (str): Contact's email address
        service_interest (str): Service they're interested in
        message (str): Their message
    
    Returns:
        dict: Response from Airtable API with created record info, or None if error
    """
    url = f"{AIRTABLE_API_URL}/Contact Form Responses"
    
    # Generate ISO timestamp with 24hr format
    timestamp = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.000Z')
    
    payload = {
        "fields": {
            "firstName": first_name,
            "lastName": last_name,
            "email": email,
            "serviceInterest": service_interest,
            "message": message,
            "dateOfReachout": timestamp
        }
    }
    
    try:
        response = requests.post(url, json=payload, headers=HEADERS)
        response.raise_for_status()
        return response.json()
    
    except requests.exceptions.RequestException as e:
        print(f"Error saving contact form response to Airtable: {e}")
        return None
