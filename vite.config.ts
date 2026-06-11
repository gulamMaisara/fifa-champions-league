import { defineConfig } from "@lovable.dev/vite-tanstack-config";

let cachedManifest: string | undefined;

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",
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