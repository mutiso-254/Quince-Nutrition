import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: '1scapxh3',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-03-11',
});
