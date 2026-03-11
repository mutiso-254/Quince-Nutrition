/**
 * API service for communicating with the Django backend
 */

const API_BASE_URL = 'http://localhost:8000/api';

export interface Product {
  id: string;
  itemName: string;
  itemDescription: string;
  itemPrice: number;
  itemImages: Array<{ url: string; filename: string }>;
  itemCategory: 'ebook' | 'supplement';
  features: string;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  error?: string;
}

/**
 * Fetch all products from the Airtable Inventory table
 */
export async function fetchProducts(): Promise<ProductsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/products/`);
    
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
