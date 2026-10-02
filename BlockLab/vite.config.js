import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // Relative base so the built site works from any sub-path,
  // e.g. GitHub Pages serves it at /<repo>/.
  base: './',
  test: {
    environment: 'node'
  }
});
