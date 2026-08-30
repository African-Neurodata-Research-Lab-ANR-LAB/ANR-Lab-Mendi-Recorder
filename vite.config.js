import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  base: "./",
  server: { host: "localhost", port: 5173 },
  build: { outDir: "dist", emptyOutDir: true }
});
