import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import million from "million/compiler";


export default defineConfig({
  plugins: [million.vite({ auto: true }), react(), basicSsl()],
});
