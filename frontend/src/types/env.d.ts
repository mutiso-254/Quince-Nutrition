/**
 * Environment variable type definitions
 * Provides type safety for import.meta.env variables
 */

interface ImportMetaEnv {
    // API Configuration
    readonly VITE_API_URL?: string;

    // Sanity CMS
    readonly VITE_SANITY_PROJECT_ID: string;
    readonly VITE_SANITY_DATASET?: string;

    // Application
    readonly VITE_APP_URL?: string;

    // Vite defaults
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
