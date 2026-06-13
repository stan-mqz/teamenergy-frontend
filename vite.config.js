import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Define aquí todos tus puntos de entrada HTML
        main: resolve(__dirname, 'index.html'),
        section5: resolve(__dirname, 'section5.html'),
        stats: resolve(__dirname, 'stats.html')
      }
    }
  }
});