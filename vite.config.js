import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "real-react-select": path.resolve(
        __dirname,
        "node_modules/react-select/dist/react-select.esm.js"
      ),
      "react-select": path.resolve(__dirname, "./src/lib/ReactSelectPortal.jsx"),
      "@": path.resolve(__dirname, "./src"),
      "@models": path.resolve(__dirname, "./src/models"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
