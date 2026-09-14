import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  base: "/ANR-Lab-Mendi-Recorder/",
  server: {
    host: "localhost",
    port: 5173
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
