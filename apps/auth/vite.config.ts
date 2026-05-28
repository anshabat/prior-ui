import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "@workspace/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: config.auth.APP_PORT,
  },
});
