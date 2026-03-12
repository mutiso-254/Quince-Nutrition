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
