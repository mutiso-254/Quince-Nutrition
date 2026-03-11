import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { schemas } from './sanity/schemas';

export default defineConfig({
  name: 'default',
  title: 'Quince Nutrition Blog',

  projectId: process.env.VITE_SANITY_PROJECT_ID || '',
  dataset: process.env.VITE_SANITY_DATASET || 'production',

  plugins: [structureTool(), visionTool(), codeInput()],

  schema: {
    types: schemas,
  },
});
