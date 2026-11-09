import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages project sites need /<repository>/, while custom domains use /.
// Override with VITE_BASE_PATH=/ for a custom domain.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'green-iguanas';
const base = process.env.VITE_BASE_PATH || `/${repo}/`;

export default defineConfig({
  base,
  plugins: [tailwindcss()],
  build: { outDir: 'dist', sourcemap: false },
});
