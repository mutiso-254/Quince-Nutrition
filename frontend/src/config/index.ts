/**
 * Application configuration
 * Central place for environment-dependent configuration
 */

export const config = {
    // API Configuration
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    apiEndpoints: {
        contact: '/api/contact/send/',
        products: '/api/contact/products/',
    },

    // Sanity CMS Configuration
    sanity: {
        projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '',
        dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
        apiVersion: '2024-03-11',
        useCdn: true,
    },

    // Application Configuration
    app: {
        url: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
        name: 'Quince Nutrition',
        title: 'Quince Nutrition & Consultancy',
    },

    // Feature Flags
    features: {
        enableAnalytics: import.meta.env.PROD,
        enableErrorTracking: import.meta.env.PROD,
    },
} as const;

// Validation: Ensure required config values are present
if (!config.sanity.projectId && import.meta.env.PROD) {
    console.error('VITE_SANITY_PROJECT_ID is required in production');
}
