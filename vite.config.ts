import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Maps process.env.API_KEY in the code to the secure VITE_API_KEY variable
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
    },
  };
});