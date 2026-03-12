import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { schemas } from './src/sanity/schemas';

// Read from environment variables
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '1scapxh3';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';

export default defineConfig({
  name: 'default',
  title: 'Quince Nutrition Blog',

  projectId,
  dataset,

  plugins: [structureTool(), visionTool(), codeInput()],

  schema: {
    types: schemas,
  },
});
