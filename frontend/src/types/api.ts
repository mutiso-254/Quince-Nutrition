/**
 * API response and request type definitions
 */

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface Product {
    id: string;
    itemName: string;
    itemDescription: string;
    itemPrice: number;
    itemImages: Array<{
        url: string;
        filename: string;
    }>;
    itemCategory: 'ebook' | 'supplement';
    features: string;
}

export interface ContactFormData {
    first_name: string;
    last_name: string;
    email: string;
    service: string;
    message: string;
}

export interface ContactFormResponse {
    success: boolean;
    message?: string;
    error?: string;
}

export interface ProductsResponse {
    success: boolean;
    products: Product[];
    error?: string;
}
