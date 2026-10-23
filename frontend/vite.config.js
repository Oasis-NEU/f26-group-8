import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // When frontend calls /auth/, vite passes it onto the backend
  // on port 3000. the browser thinks its the same website,
  // so it doesn't block it and we dont have to change the backend server
  server: { 
    proxy: {
      'auth': 'http://localhost:3000',
    },
  },
});
