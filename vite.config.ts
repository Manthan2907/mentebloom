import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      // Standalone landing-page folder, imported via @landing (see LandingPage.tsx)
      "@landing": path.resolve(import.meta.dirname, "correct landing page"),
      // Next.js shims so landing-page components run inside Vite without Next.js
      "next/link": path.resolve(import.meta.dirname, "client", "src", "shims", "NextLink.tsx"),
      "next/image": path.resolve(import.meta.dirname, "client", "src", "shims", "NextImage.tsx"),
    },
    dedupe: ["react", "react-dom", "framer-motion"],
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    // Allow the v0 preview proxy host and any tunneling host
    allowedHosts: true,
  },
});
