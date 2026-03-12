import { createClient } from '@sanity/client';
import { config } from '@/config';

const { projectId, dataset, apiVersion, useCdn } = config.sanity;

if (!projectId) {
  throw new Error(
    'VITE_SANITY_PROJECT_ID is required. Please add it to your .env file.'
  );
}

export const client = createClient({
  projectId,
  dataset,
  useCdn,
  apiVersion,
});