import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import app from './server/index';

const apiServerPlugin: Plugin = {
  name: 'api-server-middleware',
  configureServer(server) {
    // Mount the Express backend directly in Vite's development server
    server.middlewares.use(app);
  },
};

export default defineConfig({
  plugins: [react(), apiServerPlugin],
  server: {
    port: 3000,
    host: true,
  },
});
