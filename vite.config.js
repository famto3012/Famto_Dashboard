import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "real-react-select",
        replacement: path.resolve(
          __dirname,
          "node_modules/react-select/dist/react-select.esm.js"
        ),
      },
      {
        find: /^react-select$/,
        replacement: path.resolve(__dirname, "./src/lib/ReactSelectPortal.jsx"),
      },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: "@models", replacement: path.resolve(__dirname, "./src/models") },
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
