import { defineConfig } from "@lovable.dev/vite-tanstack-config";

let cachedManifest: string | undefined;

export default defineConfig({
  server: {
    proxy: {
      '/api/games': {
        target: 'https://worldcup26.ir/get/games',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/games/, '')
      },
      '/api/football-data': {
        target: 'https://api.football-data.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/football-data/, '/v4/competitions/2000/matches'),
        headers: {
          'X-Auth-Token': 'd8afd8801d934f07b163454a6b4b9b6e'
        }
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
    routeRules: {
      '/api/games': { proxy: 'https://worldcup26.ir/get/games' },
      '/api/football-data': { proxy: 'https://api.football-data.org/v4/competitions/2000/matches' }
    }
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