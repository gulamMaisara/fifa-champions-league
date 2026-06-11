import { defineConfig } from "@lovable.dev/vite-tanstack-config";

let cachedManifest: string | undefined;

export default defineConfig({
  server: {
    proxy: {
      '/api/games': {
        target: 'https://worldcup26.ir/get/games',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/games/, '')
      }
    }
  },
  tanstackStart: {
    server: {
      entry: "server",
    },
    serverFns: {
      disableCsrfMiddlewareWarning: true,
    },
  },
  
  nitro: {
    preset: "vercel",
  },

  plugins: [
    {
      name: "fix-tanstack-nitro-manifest",
      enforce: "post",
      transform(code, id) {
        if (id.includes("tanstack-start-manifest")) {
          if (this.environment?.name === "ssr") {
            cachedManifest = code;
          } else if (this.environment?.name === "nitro" && cachedManifest) {
            return cachedManifest;
          }
        }
      },
    },
  ],
});