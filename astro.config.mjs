// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://leafy-douhua-1f1130.netlify.app/',
  integrations: [react()],
  adapter: netlify(),
});