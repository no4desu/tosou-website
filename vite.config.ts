import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "\u30af\u30e9\u30a4\u30a2\u30f3\u30c8", "src"),
      "@shared": path.resolve(import.meta.dirname, "\u5171\u6709"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "\u30af\u30e9\u30a4\u30a2\u30f3\u30c8"),
  publicDir: path.resolve(import.meta.dirname, "\u30af\u30e9\u30a4\u30a2\u30f3\u30c8", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});
