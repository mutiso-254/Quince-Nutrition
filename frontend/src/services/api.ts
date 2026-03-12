/**
 * API service for communicating with the Django backend
 */

import { config } from '@/config';
import type {
  ProductsResponse,
  ContactFormData,
  ContactFormResponse,
  Product
} from '@/types/api';

// Re-export types for convenience
export type { Product, ProductsResponse, ContactFormData, ContactFormResponse };

const { apiUrl, apiEndpoints } = config;

/**
 * Fetch all products from the Airtable Inventory table
 */
export async function fetchProducts(): Promise<ProductsResponse> {
  try {
    const response = await fetch(`${apiUrl}${apiEndpoints.products}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      products: [],
      error: error instanceof Error ? error.message : 'Failed to fetch products'
    };
  }
}

/**
 * Submit contact form data to the backend
 */
export async function submitContactForm(formData: ContactFormData): Promise<ContactFormResponse> {
  try {
    const response = await fetch(`${apiUrl}${apiEndpoints.contact}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit contact form'
    };
  }
}

/**
 * Checkout types
 */
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
export async function createCheckout(data: CheckoutRequest): Promise<CheckoutResponse> {
  try {
    const response = await fetch(`${apiUrl}/api/payments/checkout/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating checkout:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout'
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
    console.error('Error fetching order status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch order status'
    };
  }
}
