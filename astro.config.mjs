import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://mihara-map.pages.dev',
  integrations: [tailwind()],
  output: 'static',
});