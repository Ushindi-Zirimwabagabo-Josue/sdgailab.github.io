import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  site: 'https://sdgailab.org',
  base: process.env.GITHUB_PAGES_BASE || '/',
  redirects: {
    '/focus-areas': '/expertise',
  },
  integrations: [react(), tailwind()],
  vite: {
    optimizeDeps: {
      include: [
        '@supabase/supabase-js',
        '@uiw/react-md-editor',
        '@uiw/react-markdown-preview',
        'marked',
      ],
    },
    ssr: {
      noExternal: ['@uiw/react-md-editor', '@uiw/react-markdown-preview'],
    },
  },
});
