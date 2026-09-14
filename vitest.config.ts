import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    test: {
      environment: "node",
      env,
      include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "server-only": path.resolve(__dirname, "./src/test/server-only.ts"),
      },
    },
  };
});
