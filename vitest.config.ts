import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    // Путь абсолютный: над проектом лежит чужой каталог со своим конфигом,
    // и относительный путь разрешался от него, а не от нашего корня.
    setupFiles: [path.resolve(__dirname, "./src/test/setup.ts")],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    root: __dirname,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
